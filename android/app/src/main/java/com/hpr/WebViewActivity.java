package com.hpr;

import android.os.Bundle;
import android.support.annotation.Nullable;

public class WebViewActivity extends BaseRNActivity {
    public WebViewActivity () {
        super("HPRApp");
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        // 把初始化 url 作为 prop 传递给 React 根节点
        String url = getIntent().getStringExtra("url");
        Bundle bundle = new Bundle();
        bundle.putString("startPage", url);
        setInitialProperties(bundle);

        super.onCreate(savedInstanceState);
    }
}
