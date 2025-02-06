# Benchmark 10_000 Elements 

|        Task name         |  Latency avg (ns)  |     Latency med (ns)     | Throughput avg (ops/s) | Throughput med (ops/s) | Samples |
| :----------------------: | :----------------: | :----------------------: | :--------------------: | :--------------------: | :-----: |
|    Single Row Insert     | 7093794754 ± 3.47% | 6949164041 ± 47577209.00 |       0 ± 3.26%        |         0 ± 0          |   10    |
|       Batch Insert       |                    |                          |                        |                        |         |
| JSON Populate Recordset  | 301884269 ± 4.88%  | 286081791 ± 11085562.50  |       3 ± 1.49%        |         3 ± 0          |   202   |
| JSONB Populate Recordset | 344378437 ± 3.26%  | 320538375 ± 15420583.00  |       3 ± 2.08%        |         3 ± 0          |   175   |
|   JSON Array Elements    | 547245849 ± 2.45%  | 531220875 ± 25226042.00  |       2 ± 1.88%        |         2 ± 0          |   111   |
|   JSONB Array Elements   | 364376906 ± 2.46%  | 348111167 ± 17817667.00  |       3 ± 1.70%        |         3 ± 0          |   165   |
