package com.hpr.module;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.hpr.RNStageActivity;

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
        if (url.startsWith("http")) {
            // 打开容器
            Intent intent = new Intent(getCurrentActivity(), RNStageActivity.class);

            Bundle initProps = new Bundle();
            initProps.putString("startPage", url);

            intent.putExtra("AppName", "HPRApp");
            intent.putExtra("InitProps", initProps);

            getCurrentActivity().startActivity(intent);
        } else if (url.startsWith("rn://")) {
            // 打开其他RN页面
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
            // do nothing
        }
    }
}
