package com.webview4rn;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.EditText;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        findViewById(R.id.jump_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String url = "";
                EditText editText = (EditText) findViewById(R.id.webUrl);
                url = editText.getText().toString();

                if (url == "") {
                    url = "https://baidu.com"; // default
                }

                Intent intent = new Intent(MainActivity.this, WebViewActivity.class);
                intent.putExtra("url", url);
                startActivity(intent);
            }
        });
    }
}
