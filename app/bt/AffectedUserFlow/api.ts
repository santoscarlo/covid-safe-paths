const verificationUrl = 'https://fakeurl';

const defaultHeaders = {
  'content-type': 'application/json',
  accept: 'application/json',
};

interface NetworkSuccess<T> {
  kind: 'success';
  body: T;
}
interface NetworkFailure<U> {
  kind: 'failure';
  error: U;
}

export type NetworkResponse<T, U = 'Unknown'> =
  | NetworkSuccess<T>
  | NetworkFailure<U>;

type CodeVerificationSuccess = 'Verified';

type CodeVerificationError = 'InvalidCode' | 'Unknown';

export const postVerificationCode = async (
  code: string,
): Promise<NetworkResponse<CodeVerificationSuccess, CodeVerificationError>> => {
  const url = verificationUrl;

  const data = {
    code,
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });

    const json = await response.json();
    if (response.ok) {
      return { kind: 'success', body: 'Verified' };
    } else {
      switch (json.error) {
        case 'invalid_code':
          return { kind: 'failure', error: 'InvalidCode' };
        default:
          return { kind: 'failure', error: 'Unknown' };
      }
    }
  } catch (e) {
    return { kind: 'failure', error: 'Unknown' };
  }
};
