package com.hpr;

import android.content.Intent;
import android.os.Bundle;

/**
 * Created by me2 on 2018/4/11.
 */

public class HPRActivity extends RNStageActivity {
    public HPRActivity() {
        super("HPRPage", null);
        isCoverBack = true; // 接管返回键
    }

    @Override
    protected void parseParams() {
        Intent intent = getIntent();

        String url = intent.getStringExtra("startPage");

        Bundle initialProps = new Bundle();
        initialProps.putString("startPage", url);
        initialProperties = initialProps;
    }
}
