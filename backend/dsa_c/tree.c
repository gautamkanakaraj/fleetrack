#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Node {
    char timestamp[30];
    double lat, lon;
    struct Node* left;
    struct Node* right;
} Node;

Node* insert(Node* root, char* timestamp, double lat, double lon) {
    if(root == NULL) {
        Node* newNode = (Node*)malloc(sizeof(Node));
        strcpy(newNode->timestamp, timestamp);
        newNode->lat = lat;
        newNode->lon = lon;
        newNode->left = newNode->right = NULL;
        return newNode;
    }
    if(strcmp(timestamp, root->timestamp) < 0)
        root->left = insert(root->left, timestamp, lat, lon);
    else
        root->right = insert(root->right, timestamp, lat, lon);
    return root;
}

Node* search(Node* root, char* timestamp) {
    if(root == NULL || strcmp(root->timestamp, timestamp) == 0)
        return root;
    if(strcmp(timestamp, root->timestamp) < 0)
        return search(root->left, timestamp);
    return search(root->right, timestamp);
}

int main(int argc, char *argv[]) {
    if(argc < 4 || argc % 3 != 1) {
        printf("Usage: tree <timestamp1> <lat1> <lon1> <timestamp2> <lat2> <lon2> ...\n");
        return 1;
    }

    Node* root = NULL;
    for(int i = 1; i < argc; i+=3) {
        root = insert(root, argv[i], atof(argv[i+1]), atof(argv[i+2]));
    }

    Node* found = search(root, argv[1]); // search first timestamp
    if(found) printf("Found at %s -> (%.4f, %.4f)", found->timestamp, found->lat, found->lon);
    else printf("Not Found");
    return 0;
}
