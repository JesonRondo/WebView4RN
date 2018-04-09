package com.hpr;

import android.os.Bundle;

public class WebViewActivity extends BaseRNActivity {
    /**
     * 重制开始 React Application
     */
    @Override
    protected void startReactApplication() {
        // 把初始化 url 作为 prop 传递给 React 根节点
        String url = getIntent().getStringExtra("url");
        Bundle bundle = new Bundle();
        bundle.putString("startPage", url);
        mReactRootView.startReactApplication(mReactInstanceManager, "WebView4RN", bundle);
    }

}
