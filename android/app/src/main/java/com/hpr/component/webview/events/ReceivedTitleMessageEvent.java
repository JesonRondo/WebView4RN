package com.hpr.component.webview.events;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.RCTEventEmitter;

/**
 * Created by me2 on 2018/4/13.
 */

public class ReceivedTitleMessageEvent extends Event<ProgressMessageEvent> {
    public static final String EVENT_NAME = "receivedTitleMessage";
    private String mTitle;

    public ReceivedTitleMessageEvent(int viewId, String title) {
        super(viewId);
        mTitle = title;
    }

    @Override
    public String getEventName() {
        return EVENT_NAME;
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
        data.putString("data", mTitle);
        rctEventEmitter.receiveEvent(getViewTag(), EVENT_NAME, data);
    }
}
