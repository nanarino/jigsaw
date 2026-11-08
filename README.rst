===============
nanarino jigsaw
===============

一個 拼圖游戲 DEMO 。

剛接觸 WEB 個陣時嘅作品。而家用 ``SolidJS`` 淺淺地重構一下。

.. image:: ./jigsaw/logo.svg
    :width: 96 px
    :alt: SolidJS Logo
    :target: https://www.solidjs.com/

原 ``jigsaw`` 目錄保留作爲 vite 的靜態資源目錄

.. image:: https://img.shields.io/badge/maintained%20with-pnpm%209.0-cc00ff.svg?style=for-the-badge&logo=pnpm
    :alt: pnpm 9.0
    :target: https://pnpm.io/

.. image:: https://img.shields.io/badge/Node.js-v24.15.0-026e00.svg?style=for-the-badge&logo=nodedotjs
    :alt: Node.js v24.15.0
    :target: https://nodejs.org/

.. highlight:: bash


克隆
=======
::

    # 安裝依賴
    pnpm i
    # 運行開發伺服器
    pnpm vite


構建
======
::

    pnpm build


參數
======
* ``?order={2..9}`` 寫在 ``url`` 前面，缺省為 3；超出範圍或不是整數會重定向到 ``order=3``
* ``?url=<圖片 URL>`` 用一張完整圖片，居中裁成正方形再切成碎片
* ``?url`` 冇值，或者圖片打不開，用 ``window.prompt`` 問地址
* 冇 ``url`` 參數時彈出相簿選擇相片


預覽
======
* `彈出相簿 <https://nanarino.github.io/jigsaw/>`_
* `問地址 <https://nanarino.github.io/jigsaw/?url>`_
* `網絡圖片 <https://nanarino.github.io/jigsaw/?url=https://avatars.githubusercontent.com/u/49119482>`_
* `2✖2 <https://nanarino.github.io/jigsaw/?order=2&url=/jigsaw/20210909_test.jpg>`_
* `9✖9 <https://nanarino.github.io/jigsaw/?order=9&url=/jigsaw/20210909_test.jpg>`_
