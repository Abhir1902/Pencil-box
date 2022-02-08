#include<stdio.h>
#include<string.h>
int main()
{
    char str[25];
    scanf("%[^\n]%*c",str);
    printf("%s\n",str);
    char str1[25];
    scanf("%[^\n]%*c",str1);
    strcat(str,str1);
    printf("The new string is : %s",str);

    return 0;
}