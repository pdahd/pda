#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>
#include <wchar.h>
#include <locale.h>
#include <math.h>
#include <sys/ioctl.h>
#include <termios.h>

#define PI 3.14159265

// 获取终端窗口大小
int get_terminal_size(int *rows, int *cols) {
    struct winsize ws;
    if (ioctl(STDOUT_FILENO, TIOCGWINSZ, &ws) == -1 || ws.ws_col == 0) {
        return -1;
    } else {
        *cols = ws.ws_col;
        *rows = ws.ws_row;
        return 0;
    }
}

typedef struct {
    wchar_t content;
    int x, y;  // 字符位置
    int color; // 颜色
    int size;  // 字符大小
} WaveChar;

// 将进酒的诗句
const wchar_t *poem = L"君不见黄河之水天上来，奔流到海不复回。君不见高堂明镜悲白发，朝如青丝暮成雪。人生得意须尽欢，莫使金樽空对月。天生我材必有用，千金散尽还复来。烹羊宰牛且为乐，会须一饮三百杯。岑夫子，丹丘生，将进酒，杯莫停。与君歌一曲，请君为我倾耳听。钟鼓馔玉不足贵，但愿长醉不愿醒。古来圣贤皆寂寞，惟有饮者留其名。陈王昔时宴平乐，斗酒十千恣欢谑。主人何为言少钱，径须沽取对君酌。五花马，千金裘，呼儿将出换美酒，与尔同销万古愁。";

int main() {
    setlocale(LC_CTYPE, "zh_CN.UTF-8");
    srand(time(NULL));

    int rows, cols;
    if (get_terminal_size(&rows, &cols) == -1) {
        fprintf(stderr, "无法获取终端大小\n");
        return 1;
    }

    WaveChar wave[cols * rows]; // 用数组存储所有字符

    // 初始化波浪
    for (int i = 0; i < cols * rows; i++) {
        wave[i].content = L' ';
        wave[i].x = i % cols;
        wave[i].y = i / cols;
        wave[i].color = rand() % 6 + 31; // 随机颜色
        wave[i].size = 1;
    }

    int offset = 0; // 波浪偏移量
    int poem_index = 0; // 诗句索引

    while (1) {
        wprintf(L"\033[2J"); // 清空屏幕

        for (int i = 0; i < cols * rows; i++) {
            // 计算波浪效果
            double dy = sin(2 * PI * (wave[i].x + offset) / cols) * rows / 8; // 波浪振幅
            int new_y = (int)(wave[i].y + dy) % rows;

            // 判断是否为诗句字符
            if (wave[i].x == cols - 1) { // 从最右侧生成新字符
                wave[i].content = poem[poem_index];
                poem_index = (poem_index + 1) % wcslen(poem);
                wave[i].color = 37;  // 诗句颜色
                wave[i].size = 2;  // 诗句大小
            } 

            // 设置字符颜色和大小
            wprintf(L"\033[%d;%dH\033[%dm\033[%d;%dm%lc", 
                    new_y + 1, wave[i].x + 1, 
                    wave[i].color, 
                    wave[i].size == 2 ? 1 : 0, // 1: 加粗，0: 正常
                    wave[i].size == 2 ? 93 : 37, // 93: 亮黄色，37: 白色
                    wave[i].content);
        }

        fflush(stdout);
        usleep(50000); // 调整动画速度

        offset--; // 波浪向左推进
        if (offset < 0) {
            offset += cols; 
        }
    }
    return 0;
}