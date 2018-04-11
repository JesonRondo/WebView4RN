package com.hpr.core;

import android.app.Application;
import android.content.Intent;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.shell.MainReactPackage;
import com.hpr.BuildConfig;
import com.hpr.module.camera.CameraModuleReactPackage;
import com.hpr.module.navigation.NavigationModuleReactPackage;

import java.util.Arrays;
import java.util.List;

/**
 * Created by me2 on 2018/4/11.
 */

public class RNAppManager {
    private static RNAppManager instance = null;

    private Application application = null;
    private ReactInstanceManager reactInstanceManager = null;

    private String bundleAssetsName;
    private String jsMainModulePath;

    private CameraModuleReactPackage mCameraModuleReactPackage;

    private RNAppManager() {
        // default bundle
        bundleAssetsName = "index.bundle";
        jsMainModulePath = "src/entry/index";
    }

    public static RNAppManager getInstance() {
        if (null == instance) {
            instance = new RNAppManager();
        }

        if (null != instance.getApplication() && null == instance.getReactInstanceManager()) {
            instance.initReactInstanceManager();
        }

        return instance;
    }

    public ReactInstanceManager getReactInstanceManager() {
        return reactInstanceManager;
    }

    public void initReactInstanceManager() {
        reactInstanceManager = ReactInstanceManager.builder()
                .setApplication(application)
                .setBundleAssetName(bundleAssetsName)
                .setJSMainModulePath(jsMainModulePath)
                .addPackages(getPackages())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();
    }

    /**
     * 获取包
     */
    private List<ReactPackage> getPackages() {
        mCameraModuleReactPackage = new CameraModuleReactPackage();

        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new NavigationModuleReactPackage(),
                mCameraModuleReactPackage
        );
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application mApplication) {
        application = mApplication;
    }

    public void handleActivityResult(final int requestCode, final int resultCode, final Intent data) {
        if (null != mCameraModuleReactPackage) {
            mCameraModuleReactPackage.handleActivityResult(requestCode, resultCode, data);
        }
    }
}
