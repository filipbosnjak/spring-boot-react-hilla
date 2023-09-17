package com.example.application.utils;

import java.util.Random;

public class RandomUtils {

    public static Long generateRandomId() {
        return Math.abs(new Random().nextLong());
    }
}
