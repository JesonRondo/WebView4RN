package com.hpr.util;

/**
 * Created by me2 on 2018/4/11.
 */

public class HPRUtils {
    private static HPRUtils instance = null;

    private HPRUtils () {

    }

    public static HPRUtils getInstance() {
        if (null == instance) {
            instance = new HPRUtils();
        }

        return instance;
    }

    public int randomID () {
        return (int) ((Math.random() * 9 + 1) * 100000);
    }
}
