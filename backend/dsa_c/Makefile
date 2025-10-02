CC=gcc
CFLAGS=-Wall -g
OUTDIR=.

all: sliding_window linked_list tree recursion backtracking haversine

sliding_window: sliding_window.c
	$(CC) $(CFLAGS) sliding_window.c -o $(OUTDIR)/sliding_window

linked_list: linked_list.c
	$(CC) $(CFLAGS) linked_list.c -o $(OUTDIR)/linked_list

tree: tree.c
	$(CC) $(CFLAGS) tree.c -o $(OUTDIR)/tree

recursion: recursion.c
	$(CC) $(CFLAGS) recursion.c -o $(OUTDIR)/recursion

backtracking: backtracking.c
	$(CC) $(CFLAGS) backtracking.c -o $(OUTDIR)/backtracking

haversine: haversine.c
	$(CC) $(CFLAGS) haversine.c -o $(OUTDIR)/haversine

clean:
	rm -f sliding_window linked_list tree recursion backtracking haversine
