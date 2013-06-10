/* description: Parses end executes mathematical expressions. */

/* lexical grammar */
%lex
%%

\s+                   /* skip whitespace */
\d+([.]\d+)?\b        return 'NUMBER'
"*"                   return '*'
"/"                   return '/'
"-"                   return '-'
"+"                   return '+'
"^"                   return '^'
","                   return ','
"PI"                  return 'PI'
"Pi"                  return 'PI'
"pi"                  return 'PI'
[⁰|¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹]+ return 'EXPOSANT'
"abs"                 return 'ABS'
"("                   return '('
")"                   return ')'
"E"                   return 'E'
"e"                   return 'E'
"sqrt"                return 'SQUARE'
"racine de"           return 'SQUARE'
"log"                 return 'LOG'
"ln"                  return 'LN'
"!"                   return '!'
"%"                   return '%'
"sin"                 return 'SIN'
"cos"                 return 'COS'
"tan"                 return 'TAN'
"arcsin"              return 'ARCSIN'
"arccos"              return 'ARCCOS'
"arctan"              return 'ARCTAN'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left  SQUARE ABS LOG SIN COS TAN ARCSIN ARCCOS ARCTAN LN
%left '%' '!' UMINUS '^' EXPOSANT
%left '(' ')'

%start expressions

%% /* language grammar */

expressions
    : e EOF
        {return $1;}
    ;

e
    : literal
    | additive_expression
    | multiplicative_expression
    | function_expression
    | exponent_expression
    | factorial_expression
    | parenthesis_expression
    ;

literal
    : E
        {$$ = Math.E;}
    | PI
        {$$ = Math.PI;}
    | NUMBER
        {$$ = Number(yytext);}
    | '-' e %prec UMINUS
        {$$ = -$2;}
    | NUMBER '%'
        {$$ = $1 / 100;}
    ;

additive_expression
    : e '+' e
        {$$ = $1 + $3;}
    | e '-' e
        {$$ = $1 - $3;}
    ;

multiplicative_expression
    : e '*' e
        {$$ = $1 * $3;}
    | e '/' e
        {$$ = $1 / $3;}
    | e function_expression
        {$$ = $1 * $2;}
    | e parenthesis_expression
        {$$ = $1 * $2;}
    ;

function_expression
    : SQUARE parenthesis_expression
        {$$ = Math.sqrt($2);}
    | ABS parenthesis_expression
        {$$ = Math.abs($2);}
    | LOG parenthesis_expression
        {$$ = Math.log($2);}
    | LN parenthesis_expression
        {$$ = Math.log($2) / Math.log(Math.E);}
    | SIN parenthesis_expression
        {$$ = Math.sin($2);}
    | COS parenthesis_expression
        {$$ = Math.cos($2);}
    | TAN parenthesis_expression
        {$$ = Math.tan($2);}
    | ARCSIN parenthesis_expression
        {$$ = Math.asin($2);}
    | ARCCOS parenthesis_expression
        {$$ = Math.acos($2);}
    | ARCTAN parenthesis_expression
        {$$ = Math.atan($2);}
    ;

exponent_expression
    : e '^' parenthesis_expression
        {$$ = Math.pow($1, $3);}
    | e EXPOSANT
        {{
            var exposants = ['⁰','¹','²','³','⁴','⁵','⁶','⁷','⁸','⁹'];
            var exposant = "";
            for(var i = 0; i < $2.length; i++)
              exposant += exposants.indexOf($2.charAt(i));
            $$ = Math.pow($1, exposant);
        }}
    ;

factorial_expression
    : e '!'
        {$$ = (function fact (n) { return n==0 ? 1 : fact(n-1) * n })($1);}
    ;

parenthesis_expression
    : '(' e ')'
        { $$ = $2;}
    ;

