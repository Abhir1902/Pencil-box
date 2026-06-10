with open('text2.txt','w',encoding='utf-8') as f:
    f.write("Apple\n")
    f.write("Oragne\n")
    f.write("Blue berry\n")
    f.write("Grapes\n")
    f.write("Banana\n")
    f.write("Mango\n")
    f.write("Papaya\n")
    f.write("Watermelon")
    f.write("Pineapple\n")
    f.write("guava\n")
with open('text2.txt')as f:
    l=f.readlines()
def inte(l):
    for i in range(1,len(l)):
        j=i
        while j<len(l)+1 and l[j]>l[j+1]:
            l[j],l[j+1]=l[j+1],l[j]
            j+=1
inte(l)
print(inte(l))


