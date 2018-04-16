package com.hpr.component.webview.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by me2 on 2018/4/16.
 */

public class LoadResourceMessageEvent extends Event<LoadResourceMessageEvent> {
    public static final String EVENT_NAME = "loadResourceMessage";
    private String mUrl;

    public LoadResourceMessageEvent (int viewId, String url) {
        super(viewId);
        mUrl = url;
    }

    @Override
    public String getEventName() {
        return null;
    }

    @Override
    public boolean canCoalesce() {
        return false;
    }

    @Override
    public short getCoalescingKey() {
        return 0;
    }

    @Override
    public void dispatch(RCTEventEmitter rctEventEmitter) {
        WritableMap data = Arguments.createMap();
        data.putString("data", mUrl);
        rctEventEmitter.receiveEvent(getViewTag(), EVENT_NAME, data);
    }
}
