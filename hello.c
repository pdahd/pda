#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include <time.h>

#define MAX_LINES 100
#define MAX_LENGTH 100

// 定义一个结构体来存储诗句的每一行
typedef struct {
    char content[MAX_LENGTH];
    int length;
} Line;

int main() {
    Line poem[MAX_LINES] = {
        {"君不见黄河之水天上来，", 0}, 
        {"奔流到海不复回。", 0},
        {"君不见高堂明镜悲白发，", 0},
        {"朝如青丝暮成雪。", 0},
        {"人生得意须尽欢，", 0},
        {"莫使金樽空对月。", 0},
        {"天生我材必有用，", 0},
        {"千金散尽还复来。", 0},
        {"烹羊宰牛且为乐，", 0},
        {"会须一饮三百杯。", 0},
        {"岑夫子，丹丘生，", 0},
        {"将进酒，杯莫停。", 0},
        {"与君歌一曲，", 0},
        {"请君为我倾耳听。", 0},
        {"钟鼓馔玉不足贵，", 0},
        {"但愿长醉不愿醒。", 0},
        {"古来圣贤皆寂寞，", 0},
        {"惟有饮者留其名。", 0},
        {"陈王昔时宴平乐，", 0},
        {"斗酒十千恣欢谑。", 0},
        {"主人何为言少钱，", 0},
        {"径须沽取对君酌。", 0},
        {"五花马，千金裘，", 0},
        {"呼儿将出换美酒，", 0},
        {"与尔同销万古愁。", 0}
    };

    // 计算每行诗句的长度，方便后续处理
    int num_lines = sizeof(poem) / sizeof(poem[0]);
    for (int i = 0; i < num_lines; i++) {
        poem[i].length = strlen(poem[i].content);
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
            printf("%c ", poem[line_index].content[i]);
            fflush(stdout);
            usleep(100000); // 可以调整延迟时间，控制打印速度
        }

        // 延迟一段时间，控制刷新频率
        usleep(500000); 
    }

    return 0;
}