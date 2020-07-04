import React, { useEffect, useRef, useState, MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInputKeyPressEventData } from 'react-native';
import {
  Alert,
  KeyboardAvoidingView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  Platform,
  NativeSyntheticEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Typography } from '../../components/Typography';
import { Theme } from '../../constants/themes';
import exitWarningAlert from './exitWarningAlert';
import exportCodeApi from '../../api/export/exportCodeApi';
import { Screens } from '../../navigation';
import { isGPS } from '../../COVIDSafePathsConfig';
import { useStrategyContent } from '../../TracingStrategyContext';

import { Icons } from '../../assets';
import { Colors } from '../../styles';
import {
  NavigationScreenProp,
  NavigationRoute,
  NavigationState,
  NavigationParams,
} from 'react-navigation';
import { HealthcareAuthority } from '../../store/types';

const CODE_LENGTH = 6;

const CodeInput = ({
  code,
  length,
  setCode,
}: {
  code: string;
  length: number;
  setCode: (code: string) => void;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const characters: string[] = [];
  for (let i = 0; i < length; i++) characters.push(code[i]);

  const characterRefs: MutableRefObject<TextInput[]> = useRef([]);
  useEffect(() => {
    characterRefs.current = characterRefs.current.slice(0, length);
  }, [length]);

  const focus = (i: number) => {
    characterRefs.current[i].focus();
  };

  // Focus on mount
  useEffect(() => {
    setTimeout(() => {
      focus(0);
    }, 0); // allow waiting for transition to end & first paint
  }, []);

  const onFocus = (i: number) => {
    if (i > currentIndex) {
      // prohibit skipping forward
      focus(currentIndex);
    } else {
      // restart at clicked character
      setCurrentIndex(i);
      setCode(code.slice(0, i));
    }
  };

  // Adding characters
  const onChangeCharacter = (d: string) => {
    if (d.length) {
      setCode(code.slice(0, currentIndex) + d);
      const nextIndex = currentIndex + 1;
      if (nextIndex < length) {
        setCurrentIndex(nextIndex);
        focus(nextIndex);
      }
    }
  };

  // Removing characters
  const onKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace') {
      // go to previous
      if (!code[currentIndex]) {
        const newIndex = currentIndex - 1;
        if (newIndex >= 0) {
          setCurrentIndex(newIndex);
          setCode(code.slice(0, newIndex));
          focus(newIndex);
        }
      }
      // clear current (used for last character)
      else {
        setCode(code.slice(0, currentIndex));
      }
    }
  };

  return (
    <View style={{ flexDirection: 'row', flexShrink: 1 }}>
      {characters.map((character, i) => (
        <TextInput
          ref={(ref) => {
            if (ref != null) {
              characterRefs.current[i] = ref;
            }
          }}
          key={`${i}CodeCharacter`}
          value={character}
          style={[
            styles.characterInput,
            {
              borderColor: character
                ? Colors.primaryBorder
                : Colors.quaternaryViolet,
            },
          ]}
          keyboardType={'number-pad'}
          returnKeyType={'done'}
          onChangeText={onChangeCharacter}
          onKeyPress={onKeyPress}
          blurOnSubmit={false}
          onFocus={() => onFocus(i)}
          testID={`input${i}`}
        />
      ))}
    </View>
  );
};

export const ExportCodeInput = ({
  route,
  navigation,
}: {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  route: NavigationRoute;
}): JSX.Element => {
  const { t } = useTranslation();
  const { InterpolatedStrategyCopy, StrategyCopy } = useStrategyContent();

  const exportCodeInputNextRoute = isGPS
    ? Screens.ExportLocationConsent
    : Screens.PublishConsent;

  const exportExitRoute = isGPS ? Screens.ExportStart : Screens.Settings;

  const [code, setCode] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [codeInvalid, setCodeInvalid] = useState(false);

  const selectedAuthority: HealthcareAuthority =
    route.params?.selectedAuthority;
  const validateCode = async () => {
    setIsCheckingCode(true);
    setCodeInvalid(false);
    try {
      if (isGPS) {
        const { valid } = await exportCodeApi(selectedAuthority, Number(code));

        if (valid) {
          navigation.navigate(exportCodeInputNextRoute, {
            selectedAuthority,
            code,
          });
        } else {
          setCodeInvalid(true);
        }
        setIsCheckingCode(false);
      } else {
        const valid = code === '123456';

        if (valid) {
          navigation.navigate(exportCodeInputNextRoute, {
            selectedAuthority,
            code,
          });
        } else {
          setCodeInvalid(true);
        }
        setIsCheckingCode(false);
      }
    } catch (e) {
      Alert.alert(t('common.something_went_wrong'), e.message);
      setIsCheckingCode(false);
    }
  };

  return (
    <Theme use='default'>
      <StatusBar
        barStyle='dark-content'
        backgroundColor={Colors.primaryBackgroundFaintShade}
        translucent={false}
      />
      <SafeAreaView style={styles.wrapper}>
        <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
          <View style={styles.headerIcons}>
            <IconButton
              icon={Icons.BackArrow}
              size={27}
              onPress={() => navigation.goBack()}
            />
            <IconButton
              icon={Icons.Close}
              size={22}
              onPress={() => exitWarningAlert(navigation, exportExitRoute)}
            />
          </View>
          <View style={{ flex: 1, marginBottom: 20 }}>
            <Typography use='headline2'>
              {StrategyCopy.exportCodeTitle}
            </Typography>
            <View style={{ height: 8 }} />
            <Typography use='body1'>
              {InterpolatedStrategyCopy.exportCodeBody(selectedAuthority.name)}
            </Typography>
            {/* These flex grows allow for a lot of flexibility across device sizes */}
            <View style={{ maxHeight: 60, flexGrow: 1 }} />
            {/* there's a flex end bug on android, this is a hack to ensure some spacing */}
            <View
              style={{
                flexGrow: 1,
                marginVertical: Platform.OS === 'ios' ? 0 : 10,
              }}>
              <CodeInput code={code} length={CODE_LENGTH} setCode={setCode} />
              {codeInvalid && (
                <Typography style={styles.errorSubtitle} use='body2'>
                  {t('export.code_input_error')}
                </Typography>
              )}
            </View>
            <Button
              disabled={code.length < CODE_LENGTH}
              loading={isCheckingCode}
              label={t('common.next')}
              onPress={validateCode}
              testID='next-button'
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Theme>
  );
};

const styles = StyleSheet.create({
  errorSubtitle: {
    marginTop: 8,
    color: Colors.errorText,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    paddingLeft: 0,
  },
  wrapper: {
    flex: 1,
    paddingBottom: 44,
    backgroundColor: Colors.primaryBackgroundFaintShade,
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    flex: 1,
  },
  characterInput: {
    fontSize: 20,
    color: Colors.violetTextDark,
    textAlign: 'center',
    flexGrow: 1,
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 10,
    marginRight: 6,
  },
});

export default ExportCodeInput;