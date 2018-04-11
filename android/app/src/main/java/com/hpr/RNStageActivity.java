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
import com.hpr.module.camera.CameraModuleReactPackage;
import com.hpr.module.navigation.NavigationModuleReactPackage;

import java.util.Arrays;
import java.util.List;

/**
 * Created by me2 on 2018/4/9.
 */

public class RNStageActivity extends Activity {
    private static final int OVERLAY_PERMISSION_REQ_CODE = 1235;

    private CameraModuleReactPackage mCameraModuleReactPackage;

    public ReactRootView mReactRootView;
    public ReactInstanceManager mReactInstanceManager;

    private String bundleAssetsName;
    private String jsMainModulePath;
    private String moduleName;
    private Bundle initialProperties;

    /**
     * intent 打开用，extra 需要传 AppName、InitProps
     */
    public RNStageActivity() {
        // default
        bundleAssetsName = "index.bundle";
        jsMainModulePath = "src/entry/index";

        moduleName = "EmptyApp";
        initialProperties = null;
    }

    /**
     * 继承的方式打开用，如 Main Activity
     * @param appName
     * @param initialProps
     */
    public RNStageActivity(String appName, @Nullable Bundle initialProps) {
        // default
        bundleAssetsName = "index.bundle";
        jsMainModulePath = "src/entry/index";

        moduleName = appName;
        initialProperties = initialProps;
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
     * 解析参数
     */
    private void parseParams() {
        Intent intent = getIntent();

        String appName = intent.getStringExtra("AppName");
        if (appName != null) {
            moduleName = appName;
        }

        Bundle initialProps = intent.getBundleExtra("InitProps");
        if (initialProps != null) {
            initialProperties = initialProps;
        }
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

        mReactRootView.startReactApplication(mReactInstanceManager, moduleName, initialProperties);
        setContentView(mReactRootView);
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

        // 获取需要的权限
        getPermission();
        // 解析intent参数
        parseParams();
        // 初始化
        initReactApplication();
        // 注册开发快捷键
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
