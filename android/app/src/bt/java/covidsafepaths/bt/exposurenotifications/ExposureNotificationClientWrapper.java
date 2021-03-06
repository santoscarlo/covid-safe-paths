package covidsafepaths.bt.exposurenotifications;

import android.content.Context;

import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.exposurenotification.ExposureInformation;
import com.google.android.gms.nearby.exposurenotification.ExposureNotificationClient;
import com.google.android.gms.nearby.exposurenotification.ExposureSummary;
import com.google.android.gms.nearby.exposurenotification.TemporaryExposureKey;
import com.google.android.gms.tasks.Task;

import java.io.File;
import java.util.List;

import covidsafepaths.bt.exposurenotifications.nearby.ExposureConfigurations;

/**
 * Wrapper around {@link com.google.android.gms.nearby.Nearby} APIs.
 */
public class ExposureNotificationClientWrapper {

    private static ExposureNotificationClientWrapper INSTANCE;

    private final ExposureNotificationClient exposureNotificationClient;
    private final ExposureConfigurations config;

    public static ExposureNotificationClientWrapper get(Context context) {
        if (INSTANCE == null) {
            INSTANCE = new ExposureNotificationClientWrapper(context);
        }
        return INSTANCE;
    }

    ExposureNotificationClientWrapper(Context context) {
        exposureNotificationClient = Nearby.getExposureNotificationClient(context);
        config = new ExposureConfigurations(context);
    }

    public Task<Void> start() {
        return exposureNotificationClient.start();
    }

    public Task<Void> stop() {
        return exposureNotificationClient.stop();
    }

    public Task<Boolean> isEnabled() {
        return exposureNotificationClient.isEnabled();
    }

    public Task<List<TemporaryExposureKey>> getTemporaryExposureKeyHistory() {
        return exposureNotificationClient.getTemporaryExposureKeyHistory();
    }

    /**
     * Provides diagnosis key files with a stable token and {@link ExposureConfiguration} given by
     * {@link ExposureConfigurations}.
     */
    public Task<Void> provideDiagnosisKeys(List<File> files, String token) {
        return exposureNotificationClient
                .provideDiagnosisKeys(files, config.get(), token);
    }

    /**
     * Gets the {@link ExposureSummary} using the stable token.
     */
    public Task<ExposureSummary> getExposureSummary(String token) {
        return exposureNotificationClient.getExposureSummary(token);
    }

    /**
     * Gets the {@link List} of {@link ExposureInformation} using the stable token.
     */
    public Task<List<ExposureInformation>> getExposureInformation(String token) {
        return exposureNotificationClient.getExposureInformation(token);
    }

}
