#include <stdio.h>
#include <unistd.h>

int main() {
    const char *poem = "床前明月光，\n疑是地上霜。\n举头望明月，\n低头思故乡。\n";
    const char *p = poem;
    while (*p) {
        printf("%c", *p++);
        fflush(stdout); // 确保每个字符都立即打印
        usleep(200000); // 等待200毫秒
    }
    return 0;
}