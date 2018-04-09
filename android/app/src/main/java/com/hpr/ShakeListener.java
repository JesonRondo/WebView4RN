package com.hpr;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

/**
 * Created by me2 on 2018/4/9.
 */

public class ShakeListener implements SensorEventListener {
    String TAG = "ShakeListener";
    // 速度阈值，当摇晃速度达到这值后产生作用
    // 两次检测的时间间隔
    private static final int UPTATE_INTERVAL_TIME = 300;
    // 传感器管理器
    private SensorManager sensorManager;
    // 传感器
    private Sensor sensor;
    // 重力感应监听器
    private OnShakeListener onShakeListener;
    // 上下文
    private Context mContext;
    // 手机上一个位置时重力感应坐标
    private float[] lastValues = { 0, 0, 0 };
    private float[] curValues = { 0, 0, 0 };

    // 上次检测时间
    private long lastUpdateTime;
    private long curUpdateTime;

    // 构造器
    public ShakeListener(Context c) {
        // 获得监听对象
        mContext = c;
        start();
    }

    // 开始
    public void start() {
        // 获得传感器管理器
        sensorManager = (SensorManager) mContext
                .getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager != null) {
            // 获得重力传感器
            sensor = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        }
        // 注册
        if (sensor != null) {
            sensorManager.registerListener(this, sensor,
                    SensorManager.SENSOR_DELAY_GAME);
        }
    }

    // 停止检测
    public void stop() {
        sensorManager.unregisterListener(this);
    }

    // 设置重力感应监听器
    public void setOnShakeListener(OnShakeListener listener) {
        onShakeListener = listener;
    }

    private boolean isShake = false;

    // 重力感应器感应获得变化数据
    public void onSensorChanged(SensorEvent event) {
        // 现在检测时间
        curUpdateTime = System.currentTimeMillis();
        curValues = event.values;
        // 两次检测的时间间隔
        long timeInterval = curUpdateTime - lastUpdateTime;
        // 判断是否达到了检测时间间隔
        if (timeInterval < UPTATE_INTERVAL_TIME)
            return;
        isShake = false;
        lastUpdateTime = curUpdateTime;
        // 现在的时间变成last时间
        if (!isShake && (curValues[0] - lastValues[1] > 20)) {
            isShake = true;
            onShakeListener.onShake();
        }
        lastValues = curValues;
    }

    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

    // 摇晃监听接口
    public interface OnShakeListener {
        public void onShake();
    }
}
