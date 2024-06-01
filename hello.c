#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <time.h>
#include <wchar.h>
#include <locale.h>

#define MAX_LINES 100
#define MAX_LENGTH 100

// 定义一个结构体来存储诗句的每一行
typedef struct {
    wchar_t content[MAX_LENGTH];
    int length;
} Line;

int main() {
    setlocale(LC_CTYPE, "zh_CN.UTF-8"); // 设置中文编码环境

    Line poem[MAX_LINES] = {
        {L"君不见黄河之水天上来，", 0}, 
        {L"奔流到海不复回。", 0},
        {L"君不见高堂明镜悲白发，", 0},
        {L"朝如青丝暮成雪。", 0},
        {L"人生得意须尽欢，", 0},
        {L"莫使金樽空对月。", 0},
        {L"天生我材必有用，", 0},
        {L"千金散尽还复来。", 0},
        {L"烹羊宰牛且为乐，", 0},
        {L"会须一饮三百杯。", 0},
        {L"岑夫子，丹丘生，", 0},
        {L"将进酒，杯莫停。", 0},
        {L"与君歌一曲，", 0},
        {L"请君为我倾耳听。", 0},
        {L"钟鼓馔玉不足贵，", 0},
        {L"但愿长醉不愿醒。", 0},
        {L"古来圣贤皆寂寞，", 0},
        {L"惟有饮者留其名。", 0},
        {L"陈王昔时宴平乐，", 0},
        {L"斗酒十千恣欢谑。", 0},
        {L"主人何为言少钱，", 0},
        {L"径须沽取对君酌。", 0},
        {L"五花马，千金裘，", 0},
        {L"呼儿将出换美酒，", 0},
        {L"与尔同销万古愁。", 0}
    };

    // 计算每行诗句的长度，方便后续处理
    int num_lines = sizeof(poem) / sizeof(poem[0]);
    for (int i = 0; i < num_lines; i++) {
        poem[i].length = wcslen(poem[i].content);
    }

    // 初始化随机数生成器
    srand(time(NULL));

    // 循环打印诗句，实现矩阵效果
    while (1) {
        // 清空屏幕
        system("clear"); 

        // 随机选择一行诗句
        int line_index = rand() % num_lines;

        // 打印选中的诗句
        for (int i = 0; i < poem[line_index].length; i++) {
            wprintf(L"%lc ", poem[line_index].content[i]);
            fflush(stdout);
            usleep(100000); // 可以调整延迟时间，控制打印速度
        }

        // 延迟一段时间，控制刷新频率
        usleep(500000); 
    }

    return 0;
}