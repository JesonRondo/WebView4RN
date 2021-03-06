package com.hpr.module.camera;


import android.content.Intent;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Created by me2 on 2018/4/10.
 */

public class CameraModuleReactPackage implements ReactPackage {

    private CameraModule mModuleInstance;

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {

        mModuleInstance = new CameraModule(reactContext);

        List<NativeModule> modules = new ArrayList<>();

        modules.add(mModuleInstance);

        return modules;
    }

    public boolean handleActivityResult(final int requestCode, final int resultCode, final Intent data) {
        return mModuleInstance.handleActivityResult(requestCode, resultCode, data);
    }
}
