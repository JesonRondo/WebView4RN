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
import com.facebook.react.ReactRootView;
import com.hpr.core.RNAppManager;

/**
 * Created by me2 on 2018/4/9.
 */

public class RNStageActivity extends Activity {
    private static final int OVERLAY_PERMISSION_REQ_CODE = 1235;

    public ReactRootView mReactRootView;

    private String moduleName;
    private Bundle initialProperties;

    /**
     * intent 打开用，extra 需要传 AppName、InitProps
     */
    public RNStageActivity() {
        moduleName = "EmptyApp";
        initialProperties = null;
    }

    /**
     * 继承的方式打开用，如 Main Activity
     * @param appName
     * @param initialProps
     */
    public RNStageActivity(String appName, @Nullable Bundle initialProps) {
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
        if (null == RNAppManager.getInstance().getApplication()) {
            RNAppManager.getInstance().setApplication(getApplication());
        }

        mReactRootView = new ReactRootView(this);
        mReactRootView.startReactApplication(
                RNAppManager.getInstance().getReactInstanceManager(),
                moduleName,
                initialProperties);
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
                ReactInstanceManager mReactInstanceManager = RNAppManager.getInstance().getReactInstanceManager();
                if (null != mReactInstanceManager) {
                    mReactInstanceManager.showDevOptionsDialog();
                }
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
            RNAppManager.getInstance().handleActivityResult(requestCode, resultCode, data);
        }
    }
    @Override
    protected void onPause() {
        super.onPause();

        ReactInstanceManager mReactInstanceManager = RNAppManager.getInstance().getReactInstanceManager();
        if (null != mReactInstanceManager) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        ReactInstanceManager mReactInstanceManager = RNAppManager.getInstance().getReactInstanceManager();
        if (null != mReactInstanceManager) {
            mReactInstanceManager.onHostResume(this);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        ReactInstanceManager mReactInstanceManager = RNAppManager.getInstance().getReactInstanceManager();
        if (null != mReactInstanceManager) {
            mReactInstanceManager.onHostDestroy(this);
        }
    }

    @Override
    public void onBackPressed() {
        // TODO
//        ReactInstanceManager mReactInstanceManager = RNAppManager.getInstance().getReactInstanceManager();
//        if (null != mReactInstanceManager) {
//            mReactInstanceManager.onBackPressed();
//        } else {
        super.onBackPressed();
//        }
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
            ReactInstanceManager mReactInstanceManager = RNAppManager.getInstance().getReactInstanceManager();
            if (null != mReactInstanceManager) {
                mReactInstanceManager.showDevOptionsDialog();
            }
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }
}
