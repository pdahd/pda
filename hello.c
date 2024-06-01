#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <time.h>
#include <wchar.h>
#include <locale.h>

#define ROWS 30   // 终端行数
#define COLS 80    // 终端列数
#define SLEEP_TIME 50000 // 刷新时间间隔 (微秒)

typedef struct {
    wchar_t content[COLS];
    int length;
    int row;
    int fading; // 是否正在淡出
    int brightness; // 亮度，用于模拟淡出效果
} RainDrop;

// 将进酒的诗句
const wchar_t *poem[] = {
    L"君不见黄河之水天上来，",
    L"奔流到海不复回。",
    L"君不见高堂明镜悲白发，",
    L"朝如青丝暮成雪。",
    L"人生得意须尽欢，",
    L"莫使金樽空对月。",
    L"天生我材必有用，",
    L"千金散尽还复来。",
    L"烹羊宰牛且为乐，",
    L"会须一饮三百杯。",
    L"岑夫子，丹丘生，",
    L"将进酒，杯莫停。",
    L"与君歌一曲，",
    L"请君为我倾耳听。",
    L"钟鼓馔玉不足贵，",
    L"但愿长醉不愿醒。",
    L"古来圣贤皆寂寞，",
    L"惟有饮者留其名。",
    L"陈王昔时宴平乐，",
    L"斗酒十千恣欢谑。",
    L"主人何为言少钱，",
    L"径须沽取对君酌。",
    L"五花马，千金裘，",
    L"呼儿将出换美酒，",
    L"与尔同销万古愁。"
};

int main() {
    setlocale(LC_CTYPE, "zh_CN.UTF-8");

    // 初始化随机数生成器
    srand(time(NULL));

    RainDrop drops[COLS]; // 每列一个字符雨滴

    for (int i = 0; i < COLS; i++) {
        drops[i].content[0] = L' '; // 初始为空格
        drops[i].length = 1;
        drops[i].row = -1; // 初始位置在屏幕上方
        drops[i].fading = 0;
        drops[i].brightness = 0;
    }

    while (1) {
        // 清空屏幕
        wprintf(L"\033[2J"); 

        // 随机生成新的字符雨滴
        for (int i = 0; i < COLS; i++) {
            if (drops[i].row >= ROWS || drops[i].row < 0) {
                drops[i].row = 0;  // 从顶部开始
                drops[i].brightness = rand() % 10 + 1; // 随机亮度
                drops[i].length = wcslen(poem[rand() % (sizeof(poem) / sizeof(poem[0]))]);
                wcscpy(drops[i].content, poem[rand() % (sizeof(poem) / sizeof(poem[0]))]);
            }
        }

        // 打印字符雨
        for (int i = 0; i < COLS; i++) {
            if (drops[i].row >= 0 && drops[i].row < ROWS) {
                wprintf(L"\033[%d;%dH\033[38;2;%d;%d;%dm%ls\033[0m", 
                       drops[i].row, i + 1, 
                       drops[i].brightness * 25, drops[i].brightness * 25, drops[i].brightness * 25, // RGB颜色，模拟亮度
                       drops[i].content);
                    drops[i].row++;
            }
        }
            
        fflush(stdout);
        usleep(SLEEP_TIME);
    }
    return 0;
}