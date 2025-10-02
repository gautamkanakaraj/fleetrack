#include <stdio.h>
#include <math.h>

#define EARTH_RADIUS 6371.0

double toRadians(double degree) {
    return degree * M_PI / 180.0;
}

double haversine(double lat1, double lon1, double lat2, double lon2) {
    lat1 = toRadians(lat1);
    lon1 = toRadians(lon1);
    lat2 = toRadians(lat2);
    lon2 = toRadians(lon2);

    double dlat = lat2 - lat1;
    double dlon = lon2 - lon1;

    double a = pow(sin(dlat / 2), 2) +
               cos(lat1) * cos(lat2) * pow(sin(dlon / 2), 2);
    double c = 2 * atan2(sqrt(a), sqrt(1 - a));

    return EARTH_RADIUS * c;
}

int main(int argc, char *argv[]) {
    if(argc < 5) {
        printf("Usage: haversine <lat1> <lon1> <lat2> <lon2>\n");
        return 1;
    }

    double dist = haversine(atof(argv[1]), atof(argv[2]), atof(argv[3]), atof(argv[4]));
    printf("Distance: %.3f km", dist);
    return 0;
}
