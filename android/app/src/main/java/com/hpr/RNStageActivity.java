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
import com.hpr.util.HPRUtils;

/**
 * Created by me2 on 2018/4/9.
 */

public class RNStageActivity extends Activity {
    private static final int OVERLAY_PERMISSION_REQ_CODE = 1235;

    public ReactRootView mReactRootView;

    protected String moduleName;
    protected Bundle initialProperties;

    private int activityId;
    protected boolean isCoverBack; // 是否接管返回键

    /**
     * intent 打开用，extra 需要传 AppName、InitProps
     */
    public RNStageActivity() {
        activityId = HPRUtils.getInstance().randomID();
        isCoverBack = false;

        moduleName = "EmptyApp";
        initialProperties = new Bundle();
    }

    /**
     * 继承的方式打开用，如 MainActivity、HPRActivity
     * @param appName
     * @param initialProps
     */
    public RNStageActivity(String appName, @Nullable Bundle initialProps) {
        activityId = HPRUtils.getInstance().randomID();
        isCoverBack = false;

        moduleName = appName;
        if (null != initialProps) {
            initialProperties = initialProps;
        } else {
            initialProperties = new Bundle();
        }
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
    protected void parseParams() {
        Intent intent = getIntent();

        String appName = intent.getStringExtra("PageName");
        if (null != appName) {
            moduleName = appName;
        }

        Bundle initialProps = intent.getBundleExtra("InitProps");
        if (null != initialProps) {
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

        initialProperties.putInt("pageKey", activityId);

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

        // Activity 压入 Map 中
        RNAppManager.getInstance().addReactActivity(activityId, this);

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

        // Activity 从 Map 中移除
        RNAppManager.getInstance().removeReactActivity(activityId);
    }

    @Override
    public void onBackPressed() {
        if (isCoverBack) {
            // 接管返回键，则完全给 RN 来管理返回按键
            // 比如 HRPActivity 里，需要管理 WebView 的返回，则代理掉
            ReactInstanceManager mReactInstanceManager = RNAppManager.getInstance().getReactInstanceManager();
            if (null != mReactInstanceManager) {
                mReactInstanceManager.onBackPressed();
            }
        } else {
            // 走系统默认返回，关闭 Activity or 退出程序
            super.onBackPressed();
        }
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
