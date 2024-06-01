#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>
#include <wchar.h>
#include <locale.h>
#include <sys/ioctl.h>
#include <termios.h>

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
    wchar_t content[2]; 
    int row;
    int col;
    int speed;  
    int brightness;
} RainDrop;

// 将进酒的诗句，竖向排列
const wchar_t *poem[] = {
    L"君", L"不", L"见", L"黄", L"河", L"之", L"水", L"天", L"上", L"来", L"，",
    L"奔", L"流", L"到", L"海", L"不", L"复", L"回", L"。",
    // ... 其他诗句，每个字占一行 ...
};

int main() {
    setlocale(LC_CTYPE, "zh_CN.UTF-8");
    srand(time(NULL));

    int rows, cols;
    if (get_terminal_size(&rows, &cols) == -1) {
        fprintf(stderr, "无法获取终端大小\n");
        return 1;
    }

    RainDrop drops[cols];

    for (int i = 0; i < cols; i++) {
        drops[i].content[0] = poem[rand() % (sizeof(poem) / sizeof(poem[0]))][0]; 
        drops[i].row = -i; //  从屏幕顶部依次排列
        drops[i].col = i;
        drops[i].speed = rand() % 3 + 1;  // 调整速度
        drops[i].brightness = rand() % 10 + 1; 
    }

    while (1) {
        // 清空屏幕
        wprintf(L"\033[2J");

        for (int i = 0; i < cols; i++) {
            // 更新雨滴位置
            drops[i].row += drops[i].speed;
            if (drops[i].row >= rows) {
                drops[i].row = 0; // 到达底部后回到顶部
                drops[i].content[0] = poem[rand() % (sizeof(poem) / sizeof(poem[0]))][0]; 
                drops[i].brightness = rand() % 10 + 1;
            }

            // 打印字符
            wprintf(L"\033[%d;%dH\033[38;2;%d;%d;%dm%ls\033[0m",
                    drops[i].row, drops[i].col + 1,
                    drops[i].brightness * 25, drops[i].brightness * 25, drops[i].brightness * 25, 
                    drops[i].content);
        }

        fflush(stdout);
        usleep(40000); //  调整刷新时间间隔
    }

    return 0;
}