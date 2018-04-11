package com.hpr.module.navigation;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.hpr.RNStageActivity;

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
     * @param url 格式 rn://[AppName]?props1=props1value&... ，props 是可选参数，
     *            如果为 http || https 开头的链接，会转到 HPRApp 去打开
     */
    @ReactMethod
    public void push(String url) {
        // 格式化 http 链接
        if (url.startsWith("http")) {
            try {
                String query = URLEncoder.encode(url, "utf-8");
                url = "rn://HPRApp?startPage=" + query;
            } catch (UnsupportedEncodingException e) {
                // not support url
                return;
            }
        }

        // 打开RN页面
        if (url.startsWith("rn://")) {
            Activity currentActivity = getCurrentActivity();

            if (null != currentActivity) {
                Intent intent = new Intent(currentActivity, RNStageActivity.class);

                Uri uri = Uri.parse(url);
                String appName = uri.getHost();

                // AppName
                intent.putExtra("AppName", appName);

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
     * 关掉一个页面
     */
    @ReactMethod
    public void pop() {
        Activity currentActivity = getCurrentActivity();

        if (null != currentActivity) {
            currentActivity.finish();
        }
    }
}
