def primeiro(n):
  (n | split(" - ")[0] | gsub("^\\s+|\\s+$"; "")) as $n2
  | if ($n2 | test("(?i)im[oó]ve|imobili|urbanismo|construtora|neg[oó]cios|realty|consultoria|corretora de")) then $n2
    else ($n2 | split(" ")[0]) as $t
      | if ($t | length) <= 2 or ($t | endswith(".")) then $n2
        else ($t[0:1] | ascii_upcase) + $t[1:] end
    end;
($ci[0] | map(select((.usuarios|length) > 0) | {id_user: .usuarios[0].id_user, nome, slug, com_imovel: true})) as $com
| ($sg[0] | map({id_user, nome, slug})) as $sgl
| [ $wait[] as $w | (($com + $sgl) | map(select(.id_user == $w)) | .[0]) + {espera: true} ]
  + ($com | map(select(.id_user as $i | ($wait | index($i)) == null)) | map(. + {espera: false}))
| map(select(.id_user as $i | ($fora[0] | index($i)) == null))
| map(select(.nome != null and (.nome | test("User deleted") | not)))
| unique_by(.id_user) | sort_by(if .espera then 0 else 1 end)
| map(. + {primeiro: primeiro(.nome)})
