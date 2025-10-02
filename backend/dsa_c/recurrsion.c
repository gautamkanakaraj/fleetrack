#include <stdio.h>
#include <stdlib.h>

// Recursive ETA = distance / speed + ETA(remaining)
double calcETA(double dist[], double speed[], int i, int n) {
    if(i == n) return 0;
    return (dist[i] / speed[i]) * 60.0 + calcETA(dist, speed, i+1, n);
}

int main(int argc, char *argv[]) {
    if(argc < 3 || argc % 2 == 0) {
        printf("Usage: recursion <dist1> <speed1> <dist2> <speed2> ...\n");
        return 1;
    }

    int n = (argc - 1) / 2;
    double dist[n], speed[n];

    for(int i = 1, j = 0; i < argc; i+=2, j++) {
        dist[j] = atof(argv[i]);
        speed[j] = atof(argv[i+1]);
    }

    double eta = calcETA(dist, speed, 0, n);
    printf("Recursive ETA: %.2f minutes", eta);
    return 0;
}
