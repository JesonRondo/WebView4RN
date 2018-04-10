package com.hpr.module;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.hpr.WebViewActivity;

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
            Intent intent = new Intent(getCurrentActivity(), WebViewActivity.class);
            intent.putExtra("url", url);
            getCurrentActivity().startActivity(intent);
        } else {
            //TODO
        }
    }
}
