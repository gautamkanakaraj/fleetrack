#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    double lat, lon;
    double dist;
    struct Node* next;
} Node;

void printList(Node* head) {
    Node* temp = head;
    while(temp) {
        printf("(%.4f, %.4f) -> ", temp->lat, temp->lon);
        temp = temp->next;
    }
    printf("NULL");
}

int main(int argc, char *argv[]) {
    if(argc < 3 || argc % 2 == 0) {
        printf("Usage: linked_list <lat1> <lon1> <lat2> <lon2> ...\n");
        return 1;
    }

    Node* head = NULL;
    Node* tail = NULL;

    for(int i = 1; i < argc; i+=2) {
        Node* newNode = (Node*)malloc(sizeof(Node));
        newNode->lat = atof(argv[i]);
        newNode->lon = atof(argv[i+1]);
        newNode->dist = 0; // distance placeholder
        newNode->next = NULL;

        if(!head) head = newNode;
        else tail->next = newNode;
        tail = newNode;
    }

    printList(head);
    return 0;
}
