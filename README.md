# Car Game Documentation
# مستندات بازی ماشین

## Overview
## نمای کلی
This document provides a detailed explanation of the `CarGame` class, including step-by-step descriptions of each function and the physics concepts implemented in the code. The explanations are provided in both English and Persian.
این سند توضیح مفصلی از کلاس `CarGame` ارائه می‌دهد، شامل توضیحات گام به گام هر تابع و مفاهیم فیزیکی پیاده‌سازی شده در کد. توضیحات به دو زبان انگلیسی و فارسی ارائه شده‌اند.

## Table of Contents
## فهرست مطالب
1. [Introduction](#introduction)
1. [مقدمه](#introduction)
2. [Class: CarGame](#class-cargame)
2. [کلاس: CarGame](#class-cargame)
    - [Constructor](#constructor)
    - [سازنده](#constructor)
    - [Methods](#methods)
    - [توابع](#methods)
        - [getRandomColor](#getrandomcolor)
        - [generateRandomShape](#generaterandomshape)
        - [generateCubes](#generatecubes)
        - [drawCubes](#drawcubes)
        - [drawCar](#drawcar)
        - [moveCar](#movecar)
        - [updateCarPosition](#updatecarposition)
        - [createParticles](#createparticles)
        - [drawParticles](#drawparticles)
        - [applyCollisionEffect](#applycollisioneffect)
        - [updateSettings](#updatesettings)
        - [addEventListeners](#addeventlisteners)
        - [gameLoop](#gameloop)
3. [Physics Concepts](#physics-concepts)
3. [مفاهیم فیزیکی](#physics-concepts)
4. [Conclusion](#conclusion)
4. [نتیجه‌گیری](#conclusion)

## Introduction
## مقدمه
This document explains the `CarGame` class, which is a JavaScript implementation of a simple car game. The game involves controlling a car on a canvas, avoiding and interacting with randomly generated cubes.
این سند کلاس `CarGame` را توضیح می‌دهد که یک پیاده‌سازی جاوااسکریپت از یک بازی ماشین ساده است. بازی شامل کنترل یک ماشین روی یک بوم، اجتناب و تعامل با مکعب‌های تصادفی تولید شده است.

## Class: CarGame
## کلاس: CarGame

### Constructor
### سازنده
The constructor initializes the game by setting up the canvas, car properties, and event listeners.
سازنده بازی را با تنظیم بوم، ویژگی‌های ماشین و شنونده‌های رویداد راه‌اندازی می‌کند.

### Methods
### توابع

#### getRandomColor
Generates a random color in hexadecimal format.
یک رنگ تصادفی در قالب هگزادسیمال تولید می‌کند.

#### generateRandomShape
Generates a random shape for the car.
یک شکل تصادفی برای ماشین تولید می‌کند.

#### generateCubes
Generates random cubes on the canvas.
مکعب‌های تصادفی روی بوم تولید می‌کند.

#### drawCubes
Draws the cubes on the canvas.
مکعب‌ها را روی بوم رسم می‌کند.

#### drawCar
Draws the car on the canvas.
ماشین را روی بوم رسم می‌کند.

#### moveCar
Handles the car's movement based on user input.
حرکت ماشین را بر اساس ورودی کاربر مدیریت می‌کند.

#### updateCarPosition
Updates the car's position and checks for collisions.
موقعیت ماشین را به‌روزرسانی می‌کند و برخوردها را بررسی می‌کند.

#### createParticles
Creates particles for visual effects.
ذراتی برای افکت‌های بصری ایجاد می‌کند.

#### drawParticles
Draws particles on the canvas.
ذرات را روی بوم رسم می‌کند.

#### applyCollisionEffect
Applies effects when the car collides with a cube.
افکت‌هایی را زمانی که ماشین با یک مکعب برخورد می‌کند اعمال می‌کند.

#### updateSettings
Updates game settings based on user input.
تنظیمات بازی را بر اساس ورودی کاربر به‌روزرسانی می‌کند.

#### addEventListeners
Adds event listeners for user input.
شنونده‌های رویداد را برای ورودی کاربر اضافه می‌کند.

#### gameLoop
Main game loop that updates and renders the game.
حلقه اصلی بازی که بازی را به‌روزرسانی و رندر می‌کند.

## Physics Concepts
## مفاهیم فیزیکی
The `CarGame` class incorporates several physics concepts to simulate realistic movement and interactions:
کلاس `CarGame` چندین مفهوم فیزیکی را برای شبیه‌سازی حرکت و تعاملات واقعی به کار می‌برد:

1. **Acceleration and Friction**:
1. **شتاب و اصطکاک**:
    - The car's movement is influenced by acceleration when the arrow keys are pressed.
    - حرکت ماشین تحت تأثیر شتاب زمانی که کلیدهای جهت‌دار فشار داده می‌شوند، قرار می‌گیرد.
    - Friction is applied to gradually reduce the car's speed, simulating resistance.
    - اصطکاک برای کاهش تدریجی سرعت ماشین اعمال می‌شود و مقاومت را شبیه‌سازی می‌کند.

2. **Collision Detection**:
2. **تشخیص برخورد**:
    - The game checks for collisions between the car and cubes by calculating the distance between their centers.
    - بازی برخورد بین ماشین و مکعب‌ها را با محاسبه فاصله بین مراکز آن‌ها بررسی می‌کند.
    - When a collision is detected, the car's speed is reversed, and a visual effect is applied.
    - زمانی که برخورد تشخیص داده می‌شود، سرعت ماشین معکوس می‌شود و یک اثر بصری اعمال می‌شود.

3. **Particle Effects**:
3. **افکت‌های ذرات**:
    - Particles are created upon collision to provide a visual representation of the impact.
    - ذرات در هنگام برخورد ایجاد می‌شوند تا نمایشی بصری از تأثیر برخورد ارائه دهند.
    - Each particle has its own velocity and lifespan, simulating debris from the collision.
    - هر ذره دارای سرعت و عمر خود است که شبیه‌سازی بقایای برخورد را انجام می‌دهد.

4. **Random Movement and Rotation**:
4. **حرکت و چرخش تصادفی**:
    - Cubes move and rotate randomly, adding dynamic behavior to the game environment.
    - مکعب‌ها به صورت تصادفی حرکت و چرخش می‌کنند و رفتار دینامیکی به محیط بازی اضافه می‌کنند.
    - The cubes' movement is bounded by the canvas edges, and they bounce back upon hitting the edges.
    - حرکت مکعب‌ها توسط لبه‌های بوم محدود می‌شود و در صورت برخورد با لبه‌ها باز می‌گردند.

## Conclusion
## نتیجه‌گیری
This document provides a comprehensive overview of the `CarGame` class, detailing each function and the physics concepts implemented. The explanations are provided in both English and Persian to cater to a wider audience.
این سند یک نمای کلی جامع از کلاس `CarGame` ارائه می‌دهد و هر تابع و مفاهیم فیزیکی پیاده‌سازی شده را به تفصیل توضیح می‌دهد. توضیحات به دو زبان انگلیسی و فارسی ارائه شده‌اند تا به مخاطبان گسترده‌تری پاسخ دهند.


## Dev and Doc by Tariux :>
