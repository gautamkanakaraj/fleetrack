#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    if(argc < 3) {
        printf("Usage: sliding_window <distance_km> <speed1> <speed2> ...\n");
        return 1;
    }

    double distance = atof(argv[1]); // remaining distance
    int n = argc - 2;
    double sum = 0;

    for(int i = 2; i < argc; i++) {
        sum += atof(argv[i]);
    }

    double avg = sum / n;
    double eta = (avg > 0) ? (distance / avg) * 60.0 : -1; // ETA in minutes

    printf("Avg Speed: %.2f km/h, ETA: %.2f minutes", avg, eta);
    return 0;
}
