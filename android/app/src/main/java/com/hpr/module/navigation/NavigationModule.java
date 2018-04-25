package com.hpr.module.navigation;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.hpr.HPRActivity;
import com.hpr.RNStageActivity;
import com.hpr.core.RNAppManager;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Set;

/**
 * Created by me2 on 2018/4/10.
 */

public class NavigationModule extends ReactContextBaseJavaModule {

    public NavigationModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "NavigationModule";
    }

    /**
     * 推出一个页面
     * @param url 格式 rn://[PageName]?props1=props1value&... ，props 是可选参数，
     *            如果为 http || https 开头的链接，会转到 HPRApp 去打开
     */
    @ReactMethod
    public void push(String url) {
        if (url.startsWith("http")) {
            // 打开 http 链接
            Activity currentActivity = getCurrentActivity();
            if (null != currentActivity) {
                Intent intent = new Intent(currentActivity, HPRActivity.class);
                intent.putExtra("startPage", url);
                currentActivity.startActivity(intent);
            }
        } else if (url.startsWith("rn://")) {
            // 打开 RN 页面
            Activity currentActivity = getCurrentActivity();

            if (null != currentActivity) {
                Intent intent = new Intent(currentActivity, RNStageActivity.class);

                Uri uri = Uri.parse(url);
                String appName = uri.getHost();

                // AppName
                intent.putExtra("PageName", appName);

                // InitProps
                Set<String> queryNames = uri.getQueryParameterNames();
                if (queryNames.size() > 0) {
                    Bundle initProps = new Bundle();

                    for (String queryName : queryNames) {
                        String queryValue = uri.getQueryParameter(queryName);

                        initProps.putString(queryName, queryValue);
                    }

                    intent.putExtra("InitProps", initProps);
                }
                currentActivity.startActivity(intent);
            } else {
                // no current activity
            }
        } else {
            // 无法识别的协议
            // do nothing
        }
    }

    /**
     * 关掉一个页面，以前页面是激活状态才会关闭，即为最顶层才关闭
     */
    @ReactMethod
    public void pop(int pageKey) {
        Activity selfActivity = RNAppManager.getInstance().getReactActivity(pageKey);
        if (null != selfActivity && getCurrentActivity() == selfActivity) {
            selfActivity.finish();
        }
    }

    /**
     * 强制关掉一个页面，不论当前页面是否是激活状态
     */
    @ReactMethod
    public void focusPop(int pageKey) {
        Activity selfActivity = RNAppManager.getInstance().getReactActivity(pageKey);
        if (null != selfActivity) {
            selfActivity.finish();
        }
    }
}
