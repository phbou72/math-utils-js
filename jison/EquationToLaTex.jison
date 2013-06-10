
/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   //skip
\d+([.]\d+)?\b        return 'NUMBER'

"alpha"               return 'SYMBOL'
"beta"                return 'SYMBOL'
"gamma"               return 'SYMBOL'
"delta"               return 'SYMBOL'
"epsilon"             return 'SYMBOL'
"zeta"                return 'SYMBOL'
"eta"                 return 'SYMBOL'
"Delta"               return 'SYMBOL'
"Theta"               return 'SYMBOL'
"theta"               return 'SYMBOL'
"iota"                return 'SYMBOL'
"kappa"               return 'SYMBOL'
"lambda"              return 'SYMBOL'
"mu"                  return 'SYMBOL'
"nu"                  return 'SYMBOL'
"xi"                  return 'SYMBOL'
"Lambda"              return 'SYMBOL'
"Xi"                  return 'SYMBOL'
"Pi"                  return 'SYMBOL'
"pi"                  return 'SYMBOL'
"rho"                 return 'SYMBOL'
"sigma"               return 'SYMBOL'
"tau"                 return 'SYMBOL'
"Sigma"               return 'SYMBOL'
"Upsilon"             return 'SYMBOL'
"Phi"                 return 'SYMBOL'
"upsilon"             return 'SYMBOL'
"phi"                 return 'SYMBOL'
"chi"                 return 'SYMBOL'
"psi"                 return 'SYMBOL'
"omega"               return 'SYMBOL'
"Psi"                 return 'SYMBOL'
"Omega"               return 'SYMBOL'

">="                  return 'GREATER_THAN_OR_EQUAL'
"<="                  return 'LESSER_THAN_OR_EQUAL'
"!="                  return 'NOT_EQUAL'
">"                   return 'GREATER_THAN'
"<"                   return 'LESSER_THAN'
"="                   return 'EQUAL'
"n'égal pas"          return 'NOT_EQUAL'
"not equal"           return 'NOT_EQUAL'

"sqrt"                return 'SQUARE'
"racine de"           return 'SQUARE'
"abs"                 return 'ABS'
"log"                 return 'FUNCTION'
"ln"                  return 'FUNCTION'
"sin"                 return 'FUNCTION'
"cos"                 return 'FUNCTION'
"tan"                 return 'FUNCTION'
"arcsin"              return 'FUNCTION'
"arccos"              return 'FUNCTION'
"arctan"              return 'FUNCTION'

[a-zA-Z]+[0-9]{1,2}   return 'VAR_INDEX' /*Tous les mots clés doivent être placés avant cette ligne*/
[a-zA-Z]+             return 'VAR'

"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
[⁰|¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹]+ return 'EXPOSANT'
"!"                   return '!'
"%"                   return '%'
"("                   return '('
")"                   return ')'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%right EQUAL NOT_EQUAL GREATER_THAN LESSER_THAN GREATER_THAN_OR_EQUAL LESSER_THAN_OR_EQUAL
%left '!' '%' UMINUS
%right SQUARE ABS FUNCTION '^' EXPOSANT
%left '(' ')'

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { return $1; }
    ;

e
    : literal
    | variable
    | additive_expression
    | multiplicative_expression
    | function_expression
    | exponent_expression
    | logical_operator
    | factorial_expression
    | parenthesis_expression
    ;


literal
    : NUMBER
        {$$ = yytext;}
    | NUMBER '%'
        {$$ = "" + $1 + "\\%";}
    | '-' e %prec UMINUS
        {$$ = "-" + $2;}
    | SYMBOL
        {$$ = "\\" + yytext;}
    ;

variable
    : VAR
        {$$ = yytext;}
    | VAR_INDEX
        {$$ = yytext;} /*À implanter*/
    ;

additive_expression
    : e '+' e
        {$$ = "" + $1 + "+" + $3;}
    | e '-' e
        {$$ = "" + $1 + "-" + $3;}
    ;

multiplicative_expression
    : e '*' e
        {$$ = $1 + "\\times " + $3;}
    | e '/' e
        {$$ = "\\frac{" + $1 + "}{" + $3 + "}";}
    | e function_expression
        {$$ = $1 + $2;}
    | e parenthesis_expression
        {$$ = $1 + $2;}
    ;

function_expression
    : FUNCTION parenthesis_expression
        {$$ = "\\" + $1 +  " " + $2;}
    | SQUARE '(' e ')'
        {$$ = "\\sqrt{" + $3 +"}";}
    | ABS  '(' e ')'
        {$$ = "\\left\|" + $3 + "\\right\|";}
    ;

logical_operator
    : e EQUAL e
        {$$ = $1 + "=" + $3;}
    | e NOT_EQUAL e
        {$$ = $1 + "\\neq " + $3;}
    | e GREATER_THAN e
        {$$ = $1 + ">" + $3;}
    | e GREATER_THAN_OR_EQUAL e
        {$$ = $1 + "\\geq " + $3;}
    | e LESSER_THAN e
        {$$ = $1 + "<" + $3;}
    | e LESSER_THAN_OR_EQUAL e
        {$$ = $1 + "\\leq " + $3;}
    ;

exponent_expression
    : e '^' '(' e ')'
        {$$ = "" + $1 + "^{" + $4 + "}";}
    | e EXPOSANT
        {{
            var exposants = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
            var exposant = "";
            for(var i = 0; i < $2.length; i++)
              exposant += exposants.indexOf($2.charAt(i));
            $$ = "" + $1 + "^{" + exposant + "}";
        }}
    ;

factorial_expression
    : e '!'
        {$$ = "" + $1 + "!";}
    ;

parenthesis_expression
    : '(' e ')'
        {$$ = "(" + $2 + ")";}
    ;
