#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <math.h>
#include <wchar.h>
#include <locale.h>

#define PI 3.14159265

// 将进酒的诗句
const wchar_t *poem = L"君不见黄河之水天上来，奔流到海不复回。君不见高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。天生我材必有用，千金散尽还复来。烹羊宰牛且为乐，会须一饮三百杯。岑夫子，丹丘生，将进酒，杯莫停。与君歌一曲，请君为我倾耳听。钟鼓馔玉不足贵，但愿长醉不愿醒。古来圣贤皆寂寞，惟有饮者留其名。陈王昔时宴平乐，斗酒十千恣欢谑。主人何为言少钱，径须沽取对君酌。五花马，千金裘，呼儿将出换美酒，与尔同销万古愁。";

int main() {
    setlocale(LC_CTYPE, "zh_CN.UTF-8");

    int radius = 10; // 圆的半径
    int center_x = 20; // 圆心 x 坐标
    int center_y = 10; // 圆心 y 坐标

    int poem_len = wcslen(poem);
    int angle = 0; // 初始角度

    while (1) {
        system("clear"); // 清除屏幕

        for (int i = 0; i < poem_len; i++) {
            // 计算字符位置
            int x = center_x + (int)(radius * cos(angle * PI / 180.0));
            int y = center_y + (int)(radius * sin(angle * PI / 180.0));

            // 打印字符
            wprintf(L"\033[%d;%dH%lc", y, x, poem[i]);

            // 更新角度, 控制旋转速度和方向
            angle = (angle + 1) % 360;

            fflush(stdout);
            usleep(50000); // 调整动画速度
        }
    }

    return 0;
}