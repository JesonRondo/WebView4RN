/*
 * MIT License
 *
 * Copyright (c) 2018 Yuriy Budiyev [yuriy.budiyev@yandex.ru]
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
package com.hpr.module.camera;

import android.Manifest;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.budiyev.android.codescanner.CodeScanner;
import com.budiyev.android.codescanner.CodeScannerView;
import com.budiyev.android.codescanner.DecodeCallback;
import com.budiyev.android.codescanner.ErrorCallback;
import com.google.zxing.Result;
import com.hpr.R;
import com.hpr.module.common.Constant;

public class CameraCodeScannerActivity extends Activity {
    private static final int RC_PERMISSION = 10;
    private CodeScanner mCodeScanner;
    private boolean mPermissionGranted;

    private Integer callbackId;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_code_scanner);

        Intent intent = getIntent();
        callbackId = intent.getIntExtra("callbackId", 0);

        mCodeScanner = new CodeScanner(this, (CodeScannerView) findViewById(R.id.scanner));
        mCodeScanner.setDecodeCallback(new DecodeCallback() {
            @Override
            public void onDecoded(@NonNull Result result) {
                resultForCode(Constant.RESULT_OK, result.toString(), callbackId);
            }
        });

        mCodeScanner.setErrorCallback(new ErrorCallback() {
            @Override
            public void onError(@NonNull Exception error) {
                resultForCode(Constant.RESULT_ERROR, error.toString(), callbackId);
            }
        });

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                mPermissionGranted = false;
                requestPermissions(new String[] {Manifest.permission.CAMERA}, RC_PERMISSION);
            } else {
                mPermissionGranted = true;
            }
        } else {
            mPermissionGranted = true;
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        if (requestCode == RC_PERMISSION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                mPermissionGranted = true;
                mCodeScanner.startPreview();
            } else {
                mPermissionGranted = false;
            }
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (mPermissionGranted) {
            mCodeScanner.startPreview();
        }
    }

    @Override
    protected void onPause() {
        mCodeScanner.stopPreview();
        super.onPause();
    }

    @Override
    public void onBackPressed() {
        resultForCode(Constant.RESULT_CANCEL, "cancel", callbackId);
        super.onBackPressed();
    }

    /**
     * 返回结果
     * @param code
     * @param result
     * @param callbackId
     */
    private void resultForCode (int code, String result, int callbackId) {
        Intent mIntent = new Intent();
        mIntent.putExtra("result", result);
        mIntent.putExtra("callbackId", callbackId);
        setResult(code, mIntent);

        finish();
    }
}