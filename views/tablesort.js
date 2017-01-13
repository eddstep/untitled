/**
 * Created by Code on 01.01.2017.
 */
$(document).ready(function (){
    $('table').tablesort({
        compare: function(a, b) {
            if (+a > +b) {
                return 1;
            } else if (+a < +b) {
                return -1;
            } else {
                return 0;
            }
        }
    });
});