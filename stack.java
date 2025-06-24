class stack
{
    private int stack[] = new int[10];
    private int tos;
    Stack()
    {
        tos=1;
    }
    void push(int item)
    {
        if(tos==9)
        {
            System.out.println("Stack is full ");
        }
        else 
        {
            stck(++tos)=item;
        }
    }
    int pop()
    {
        if(tos<0)
        
    }
}