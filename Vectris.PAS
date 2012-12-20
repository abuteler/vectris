PROGRAM VecTris;

USES
    Crt;

CONST
     ANCHO=10;
     ALTO=20;
     {KeyMap= 'A','D','W','S','P','Q';}

TYPE
     Celda= Array [1..2] of byte;
     Matrix= Array [1..ALTO,1..ANCHO] of Celda;
     T_Pieza= Record
                    X1:Integer;
                    Y1:Integer;
                    X2:Integer;
                    Y2:Integer;
                    X3:Integer;
                    Y3:Integer;
                    X4:Integer;
                    Y4:Integer;
                    Color:Integer
                    End;

VAR
   Pausa: char;
   x: integer;

{------------------ Procedimientos ---------------------}

{ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ}
Procedure SetMCGA;  { This procedure gets you into 320x200x256 mode. }
BEGIN
  asm
     mov        ax,0013h
     int        10h
  end;
END;



{ÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄÄ}
PROCEDURE ENGINE;


  {------------------ P. Pantalla ---------------------}

     Procedure Pantalla (pieza:T_Pieza; thematrix:Matrix);
     Var
        i,j:byte;
     Begin
          { Pongo las coord de la pieza en la matriz.  }
          { Como no la pase por variable, la matriz es }
          { solo una copia temporal.                  }
          With pieza do
            Begin
                 thematrix[x1,y1][1]:=1; thematrix[x1,y1][2]:=color;
                 thematrix[x2,y2][1]:=1; thematrix[x2,y2][2]:=color;
                 thematrix[x3,y3][1]:=1; thematrix[x3,y3][2]:=color;
                 thematrix[x4,y4][1]:=1; thematrix[x4,y4][2]:=color
            End;

          {Escribo la Matriz en Pantalla}
          TextColor(2);
          For i:=1 to ALTO do
            Begin
              GOTOXY(34,i+8);
              Write ('³');
              For j:=1 to ANCHO do
               Begin
               If thematrix[i,j][1]=1 then
                                          begin
                                           Textcolor(thematrix[i,j][2]);
                                           Write ('');
                                           Textcolor(2)
                                         end
                                      else
                                          Write (' ');
               End;
              Write ('³');
              Writeln; {Pasa al siguiente renglon cuando llega a ANCHO}
            End;
            GOTOXY(34,28);
            Writeln ('ÀÄÄÄÄÄÄÄÄÄÄÙ');
            TextColor(7);
     End;  {FIN de Pantalla}


  {------------------ P. Colision ---------------------}

     Procedure Colision (Var ok:boolean; thematrix:Matrix; pieza:T_Pieza);

     Begin
          ok:=FALSE;

	  If (pieza.y1 > 0) and (pieza.y1 < 11) then
             If (pieza.y2 > 0) and (pieza.y2 < 11) then
                If (pieza.y3 > 0) and (pieza.y3 < 11) then
                   If (pieza.y4 > 0) and (pieza.y4 < 11) then
		

          If thematrix[pieza.x1,pieza.y1][1]=0 then
             If thematrix[pieza.x2,pieza.y2][1]=0 then
                If thematrix[pieza.x3,pieza.y3][1]=0 then
                   If thematrix[pieza.x4,pieza.y4][1]=0 then

	  ok:=TRUE
     End;


  {------------------ P. Crea_Pieza ---------------------}

     Procedure Crea_pieza (Var pieza:T_Pieza; thematrix:matrix; Var error:boolean);
     Var
        Ok:boolean;
        Azar:byte;
     Begin
          Randomize;
          Azar:=Random (5);
          Case Azar of
               0: {Cuadrado}
                  Begin
                       With pieza do
                         Begin
                           x1:=1; y1:=5;
                           x2:=1; y2:=6;
                           x3:=2; y3:=5;
                           x4:=2; y4:=6;
                           color:=1
                         End;
                  End;

               1: {Tripode}
                  Begin
                       With pieza do
                         Begin
                           x1:=1; y1:=5;
                           x2:=2; y2:=5;
                           x3:=2; y3:=6;
                           x4:=3; y4:=5;
                           color:=14
                         End;
                  End;

               2: {Largo}
                  Begin
                       With pieza do
                         Begin
                           x1:=1; y1:=5;
                           x2:=2; y2:=5;
                           x3:=3; y3:=5;
                           x4:=4; y4:=5;
                           color:=8
                         End;
                  End;

               3: {L->}
                  Begin
                       With pieza do
                         Begin
                           x1:=1; y1:=5;
                           x2:=2; y2:=5;
                           x3:=3; y3:=5;
                           x4:=3; y4:=6;
                           color:=4
                         End;
                  End;

               4: {<-L}
                  Begin
                       With pieza do
                         Begin
                           x1:=1; y1:=5;
                           x2:=2; y2:=5;
                           x3:=3; y3:=5;
                           x4:=3; y4:=4;
                           color:=5
                         End;
                  End;

          End; {End del CASE}

          Colision (Ok, thematrix, pieza);
          If NOT(Ok) then error:=TRUE
     End; {FIN de Crea_Pieza}


  {------------------ P. Izquierda ---------------------}

     Procedure Izquierda (Var pieza:T_Pieza; thematrix:Matrix);
     Var
        Ok: boolean;
        Aux: T_Pieza;
     Begin
          With Aux do
            Begin
               x1:=pieza.x1;
               x2:=pieza.x2;
               x3:=pieza.x3;
               x4:=pieza.x4;
               y1:=pieza.y1 - 1;
               y2:=pieza.y2 - 1;
               y3:=pieza.y3 - 1;
               y4:=pieza.y4 - 1
            End;
          Colision (Ok, thematrix, Aux);
          If Ok then
                    Begin
                         With pieza do
                                  Begin
                                       y1:=y1 - 1;
                                       y2:=y2 - 1;
                                       y3:=y3 - 1;
                                       y4:=y4 - 1
                                  End;
                    End;
     End; {FIN de Izquierda}


  {------------------ P. Derecha ---------------------}

     Procedure Derecha (Var pieza:T_Pieza; thematrix:Matrix);
     Var
        Ok: boolean;
        Aux: T_Pieza;
     Begin
          With Aux do
            Begin
               x1:=pieza.x1;
               x2:=pieza.x2;
               x3:=pieza.x3;
               x4:=pieza.x4;
               y1:=pieza.y1 + 1;
               y2:=pieza.y2 + 1;
               y3:=pieza.y3 + 1;
               y4:=pieza.y4 + 1
            End;
          Colision (Ok, thematrix, Aux);
          If Ok then
                    Begin
                         With pieza do
                                  Begin
                                       y1:=y1 + 1;
                                       y2:=y2 + 1;
                                       y3:=y3 + 1;
                                       y4:=y4 + 1
                                  End;
                    End;
     End; {FIN de Derecha}


  {------------------ P. Abajo ---------------------}

     Procedure Abajo (Var pieza:T_Pieza; thematrix:Matrix; Var piso:Boolean);
     Var
        Ok: boolean;
        Aux: T_Pieza;
     Begin
        Repeat
          With Aux do
            Begin
               x1:=pieza.x1 + 1;
               x2:=pieza.x2 + 1;
               x3:=pieza.x3 + 1;
               x4:=pieza.x4 + 1;
               y1:=pieza.y1;
               y2:=pieza.y2;
               y3:=pieza.y3;
               y4:=pieza.y4
            End;
          Colision (Ok, thematrix, Aux);
          If Ok then
                    Begin
                         With pieza do
                                  Begin
                                       x1:=x1 + 1;
                                       x2:=x2 + 1;
                                       x3:=x3 + 1;
                                       x4:=x4 + 1
                                  End;
                    End
                else
                    piso:=TRUE;
        Until piso;
     End; {FIN de Abajo}


  {------------------ P. Invertir ---------------------}

     Procedure Invertir (Var pieza:T_Pieza; thematrix:Matrix);
     Var
        Ok: boolean;
        Aux: T_Pieza;
        caux: Integer; {Coordenada auxiliar para la T.L.}
     Begin
          With Aux do
            Begin
               {Convierto al (X2,Y2) en mi origen}
               x1:=pieza.x1 - pieza.x2;  y1:=pieza.y1 - pieza.y2;
               x2:=pieza.x2 - pieza.x2;  y2:=pieza.y2 - pieza.y2;
               x3:=pieza.x3 - pieza.x2;  y3:=pieza.y3 - pieza.y2;
               x4:=pieza.x4 - pieza.x2;  y4:=pieza.y4 - pieza.y2;
               {Hago la Transformacion (-Y,X) que rota 90° contra reloj}
               caux:=x1;  x1:=-y1;  y1:=caux;
               {(x2,y2) es el (0,0) por eso no hago la T.L.}
               caux:=x3;  x3:=-y3;  y3:=caux;
               caux:=x4;  x4:=-y4;  y4:=caux;
               {Devuelvo las coordenadas al sistema original}
               x1:=x1 + pieza.x2;  y1:=y1 + pieza.y2;
               x2:=x2 + pieza.x2;  y2:=y2 + pieza.y2;
               x3:=x3 + pieza.x2;  y3:=y3 + pieza.y2;
               x4:=x4 + pieza.x2;  y4:=y4 + pieza.y2;
            End;

          Colision (Ok, thematrix, Aux);
          If Ok then
                    Begin
                         With pieza do
                                  Begin
                                       x1:=Aux.x1;
                                       x2:=Aux.x2;
                                       x3:=Aux.x3;
                                       x4:=Aux.x4;
                                       y1:=Aux.y1;
                                       y2:=Aux.y2;
                                       y3:=Aux.y3;
                                       y4:=Aux.y4;
                                  End;
                    End;
     End; {FIN de Abajo}

  {------------------ P. Update_Matrix ---------------------}

     Procedure Update_Matrix (Var thematrix:Matrix; Var pieza:T_Pieza);

     Begin
          With pieza do
            Begin
                 thematrix[x1,y1][1]:=1; thematrix[x1,y1][2]:=color;
                 thematrix[x2,y2][1]:=1; thematrix[x2,y2][2]:=color;
                 thematrix[x3,y3][1]:=1; thematrix[x3,y3][2]:=color;
                 thematrix[x4,y4][1]:=1; thematrix[x4,y4][2]:=color
            End;
     End; {FIN de Update_Matrix}


   Procedure Gravedad (Var pieza:T_Pieza; thematrix:Matrix; Var piso:Boolean);
     Var
        Ok: boolean;
        Aux: T_Pieza;
     Begin
          With Aux do
            Begin
               x1:=pieza.x1 + 1;
               x2:=pieza.x2 + 1;
               x3:=pieza.x3 + 1;
               x4:=pieza.x4 + 1;
               y1:=pieza.y1;
               y2:=pieza.y2;
               y3:=pieza.y3;
               y4:=pieza.y4
            End;
          Colision (Ok, thematrix, Aux);
          If Ok then
                    Begin
                         With pieza do
                                  Begin
                                       x1:=x1 + 1;
                                       x2:=x2 + 1;
                                       x3:=x3 + 1;
                                       x4:=x4 + 1
                                  End;
                    End
                else
                    piso:=TRUE;
     End; {FIN de Gravedad}

Var
    TheMatrix: Matrix;
    Pieza: T_Pieza;
    Tecla: char;
    Error, Piso: Boolean;
    i,j:Integer;

Begin {Comienzo de ENGINE}

     {Seteo la matriz en CERO}
     For i:=1 to ALTO do
         For j:=1 to ANCHO do
           Begin
             TheMatrix[i,j][1]:=0;
             TheMatrix[i,j][2]:=0;
           End;
     {Defino el piso en la matriz}
     For i:=1 to Ancho do
     Begin
     TheMatrix[Alto,i][1]:=1;
     TheMatrix[Alto,i][2]:=9;
     End;

Error:=FALSE;
Repeat
     Piso:=FALSE;
     Crea_Pieza (Pieza, TheMatrix, Error);
     If NOT(Error) then
       Begin
        Repeat
            {Clrscr;  // creo que no hace falta}
            Pantalla (Pieza, TheMatrix);
            Delay(300);
            If Keypressed then
                Begin
                     Tecla:=Readkey;
                     Tecla:=Upcase(Tecla);
                     CASE Tecla OF

                          'W': Begin
                                    Invertir (Pieza, TheMatrix);
                               End;
                          'S': Begin
                               Abajo (Pieza, TheMatrix, Piso); {Piso es por si llega}
                               End;                            {al fondo.           }
                          'A': Begin
                               Izquierda (Pieza, TheMatrix);
                               End;
                          'D': Begin
                               Derecha (Pieza, TheMatrix);
                               End;
                          'Q': Begin
                               Exit;
                               End;
                     End;
                End
            Else
                Gravedad (Pieza, TheMatrix, Piso);
        Until Piso;
        Update_Matrix (TheMatrix, Pieza);
       End;

Until Error;  {GAME OVER}
GotoXY(33,20);
TextBackground(7);
TextColor(0);
Write ('  GAME OVER!  ');
TextColor(7);
TextBackground(0);
Tecla:=Readkey;
End; {Fin de ENGINE}

{---------------- Programa principal -------------------}

BEGIN
     Clrscr;
     SetMCGA;       {con esto paso a modo video y me agranda la pantalla  }
     Textmode(259); {con esto voy al seteo donde imprimo bien en pantalla }

                  Textcolor (8);
                  Textbackground (black);
                  for x := 1 to 80*25*2 do
                      write('°');
                  gotoxy(1,1);
                  insline;
                  Textcolor (2);
                  Textbackground (1);
                  ClrEol;
                  Write ('-=  VECTRIS  =-':48);
                  gotoxy(1,1);
                  Write ('ÌÍÍÍÍÍÍÍÍ ');
                  gotoxy(70,1);
                  Write (' ÍÍÍÍÍÍÍÍ¹');
                  Textcolor (7);
                  Textbackground (black);

     ENGINE;
     Clrscr;
END.