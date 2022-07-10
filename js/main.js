// 	<!--sessionStorage.firstIN=true; -->
// <!-- function newDoc() {
// 			-->
// <!--window.location.assign("tablacom.html") -->
// <!-- } -->
for (i = 0; i < tablaper.length; i++) {
  $("[no-atomico='" + tablaper[i].noAtomico + "' ]").html("<p class='noA'>"
    + tablaper[i].noAtomico + "</p><p class='sim'> " + tablaper[i].simbolo + "</p > "
  );
  if (tablaper[i].metal == "Metaloides") {
    $("[no-atomico='" + tablaper[i].noAtomico + "']").addClass("no-metales metaloides");
  }
  if (tablaper[i].metal == "Otros no metales") {
    $("[no-atomico='" + tablaper[i].noAtomico + "']").addClass("no-metales otros-no-metales");
  }
  if (tablaper[i].metal == "Halógenos") {
    $("[no-atomico='" + tablaper[i].noAtomico + "']").addClass("no-metales halogenos");
  }
  if (tablaper[i].metal == "Gases nobles") {
    $("[no-atomico='" + tablaper[i].noAtomico + "']").addClass("no-metales gase-nobles");
  }
  if (tablaper[i].metal == "Alcalinos") {
    $("[no-atomico='" + tablaper[i].noAtomico + "']").addClass("metales alcalinos");
  }
  if (tablaper[i].metal == "Alcalinotérreos") {
    $("[no-atomico='" + tablaper[i].noAtomico + "']").addClass("metales alcalinoterreos");
  }
  if (tablaper[i].metal == "Lantánidos") {
    $("[no-atomico='" + tablaper[i].noAtomico + "']").addClass("metales lantanidos");
  }
  if (tablaper[i].metal == "Actínidos") {
    $("[no-atomico='" + tablaper[i].noAtomico + "']").addClass("metales actinidos");
  }
  if (tablaper[i].metal == "Metales de transición") {
    $("[no-atomico='" + tablaper[i].noAtomico + "']").addClass("metales metales-de-transicion");
  }
  if (tablaper[i].metal == "Metales del bloque p") {
    $("[no-atomico='" + tablaper[i].noAtomico + "']").addClass("metales metales-de-bloque");
  }
}
$(document).ready(function () {
  mensaje();
  $(".contenedor").hide();
  $(".boton").hide();
  $(".row-s").hide();
  $(".panel2 h3").hide();
  if (sessionStorage.firstIN) {
    sessionStorage.firstIN = false;
    $("body").removeClass("bgtrans");
    $(".contenedor").fadeIn(1500);
    $(".boton").fadeIn(1501);
  }
  else {
    sessionStorage.firstIN = false;
    $(".inicio").animate({
      width: "100%",
      opacity: 1,
    }, 100, function () {
      $("body")
        .addClass("bgtrans")
        .animate({
          opacity: 1
        }, 1000, function () {
          $(".inicio").click(function () {
            $(".inicio").fadeOut(1200);
            $("body").removeClass("bgtrans");
            $(".contenedor").fadeIn(1500);
            $(".boton").fadeIn(1501);
          });
        });
    });
  }
  $(window).resize(function () {
    mensaje();
    // < !-- if (screen.height < screen.width) {
    // 			-->
    // < !--espacio=$("#t1.tablaP").outerHeight(true); -->
    // < !--espacio2=$("#t1.tablaP").innerHeight(); -->
    // < !--espacio2=espacio - espacio2; -->
    // < !-- if (!isNaN(espacio)) {
    // 				-->
    // < !-- if (screen.height > screen.width) {
    // 					-->
    // < !--wh=	screen.width; -->
    // < !-- } -->
    // < !-- else if (screen.height < screen.width) {
    // 					-->
    // < !--wh=	screen.kheight; -->
    // < !-- } -->
    // < !--altoelem=(wh - espacio2) / 9; -->
    // < !-- } -->
    // < !--$(".cell-elemt").css("height", altoelem) -->
    // < !-- } -->
  });
  $("li").click(function () {
    $("li").removeClass("selectCell");
    swal(); swal.close();
    $(".row-s").fadeOut("slow");
    numf2 = $(this).attr("nofamilia");
    $("#f" + numf2).fadeIn("slow");
    $(".panel2 h3").fadeIn("slow");
    $(this).addClass("selectCell")
  });
});
function mensaje() {
  $(".textp").html(
    "window w: " + window.innerWidth
    + " window h: " + $(window).height()
    + "<br /> document w: " + $(document).width()
    + " document h: " + $(document).height()
    + " <br />screen w: " + screen.width
    + " screen h: " + screen.height
    + "<br />#t1 tablaP w: " + $(".tablaP").innerWidth()
    + " #t1 tablaP h: " + $(".tablaP").innerHeight()
    + "<br />tablaP w: " + $(".tablaP:last").innerWidth()
    + " tablaP h: " + $(".tablaP:last").innerHeight()
    + " <br />body w: " + $("body").innerWidth()
    + " body h: " + $("body").innerHeight()
    + " <br />cell-elemt h:" + $(".cell-elemt").css("height")
    + " <br />cell-elemt w:" + $(".cell-elemt").css("width"));
}
swal(); swal.close();
$(".cell-elemt").click(function () {
  num = $(this).attr("no-atomico");
  var cadenametal;
  var cadenaclass = $(this).attr('class');
  if (posclass = cadenaclass.search("no-metales") > 0) {
    cadenametal = "No metal"
  }
  else if (posclass = cadenaclass.search("metales") > 0) {
    cadenametal = "Metal";
  }
  console.log(cadenaclass[posclass] + " " + posclass);
  $(".sweet-alert").css("background-color", $(this).css("background-color"))
  num--;
  swal({
    title: tablaper[num].nombre,
    text: "<h1>" + tablaper[num].simbolo + "</h1>"
      + "<div><span>Numero atómico :</span><strong>" + tablaper[num].noAtomico + "</strong><br />"
      + "<span>Masa Atómica: </span><strong>" + tablaper[num].masa + "</strong><br />"
      + "<span>" + cadenametal + "</span><strong>(" + tablaper[num].metal + ")</strong></div>",
    html: true,
    showConfirmButton: true
  }, function () {
    swal.close();
  });
});
