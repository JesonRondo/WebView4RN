package com.hpr;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.support.annotation.Nullable;
import android.view.KeyEvent;
import android.webkit.WebView;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactRootView;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.shell.MainReactPackage;
import com.hpr.module.CameraModuleReactPackage;
import com.hpr.module.NavigationModuleReactPackage;

import java.util.Arrays;
import java.util.List;

/**
 * Created by me2 on 2018/4/9.
 */

public class BaseRNActivity extends Activity {
    private static final int OVERLAY_PERMISSION_REQ_CODE = 1235;

    private CameraModuleReactPackage mCameraModuleReactPackage;

    public ReactRootView mReactRootView;
    public ReactInstanceManager mReactInstanceManager;

    public String bundleAssetsName;
    public String jsMainModulePath;
    public String moduleName;
    public Bundle initialProperties;

    public BaseRNActivity (String appName) {
        // default
        setBundleAssetsName("index.bundle");
        setJsMainModulePath("src/entry/index");
        setModuleName(appName);
        setInitialProperties(null);
    }

    public void setBundleAssetsName(String bundleAssetsName) {
        this.bundleAssetsName = bundleAssetsName;
    }

    public void setJsMainModulePath(String jsMainModulePath) {
        this.jsMainModulePath = jsMainModulePath;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public void setInitialProperties(Bundle initialProperties) {
        this.initialProperties = initialProperties;
    }

    /**
     * 获取权限
     */
    private void getPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            // 弹窗显示进度
            if (!Settings.canDrawOverlays(this)) {
                Intent intent = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package: " + getPackageName()));
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE);
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            // 打开 WebView 远程调试
            WebView.setWebContentsDebuggingEnabled(true);
        }
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

    /**
     * 初始化 React Application
     */
    private void initReactApplication() {
        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName(bundleAssetsName)
                .setJSMainModulePath(jsMainModulePath)
                .addPackages(getPackages())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();

        setContentView(mReactRootView);

        mReactInstanceManager.showDevOptionsDialog();
    }

    /**
     * 开始 React Application
     */
    private void startReactApplication() {
        mReactRootView.startReactApplication(mReactInstanceManager, moduleName, initialProperties);
    }

    /**
     * 开发快捷方式
     */
    private void initDevShortcut() {
        ShakeListener listener = new ShakeListener(this);
        listener.setOnShakeListener(new ShakeListener.OnShakeListener() {
            @Override
            public void onShake() {
                mReactInstanceManager.showDevOptionsDialog();
            }
        });
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getPermission();

        initReactApplication();
        startReactApplication();

        initDevShortcut();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (resultCode == OVERLAY_PERMISSION_REQ_CODE) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.canDrawOverlays(this)) {
                    // SYSTEM_ALERT_WINDOW permission not granted...
                }
            }
        } else {
            super.onActivityResult(requestCode, resultCode, data);

            if (mCameraModuleReactPackage != null) {
                mCameraModuleReactPackage.handleActivityResult(requestCode, resultCode, data);
            }
        }
    }
    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy(this);
        }
    }

    @Override
    public void onBackPressed() {
        // TODO
//        if (mReactInstanceManager != null) {
//            mReactInstanceManager.onBackPressed();
//        } else {
        super.onBackPressed();
//        }
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }
}
