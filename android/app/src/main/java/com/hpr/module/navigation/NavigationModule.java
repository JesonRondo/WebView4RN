package com.hpr.module.navigation;

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
            Intent intent = new Intent(getCurrentActivity(), RNStageActivity.class);

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
            getCurrentActivity().startActivity(intent);
        } else {
            // 无法识别的协议
            // do nothing
        }
    }
}
