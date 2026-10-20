def primeiro(n):
  (n | split(" - ")[0] | gsub("^\\s+|\\s+$"; "")) as $n2
  | if ($n2 | test("(?i)im[oó]ve|imobili|urbanismo|construtora|neg[oó]cios|realty|consultoria|corretora de")) then $n2
    else ($n2 | split(" ")[0]) as $t
      | if ($t | length) <= 2 or ($t | endswith(".")) then $n2
        else ($t[0:1] | ascii_upcase) + $t[1:] end
    end;
($si[0] | map(select((.usuarios|length) > 0) | .slug as $s | .nome as $n | .usuarios[] | select(.ativo != false) | {id_user, nome: $n, slug: $s, sms})) as $a
| ($sg[0] | map(select(.slug == null) | {id_user, nome, slug: null, sms: null})) as $b
| ($env[0] | map(.id_user)) as $ja
| ($a + $b)
| map(select(.id_user as $i | (($fora[0] + [15]) | index($i)) == null and ($ja | index($i)) == null))
| map(select((.nome // "") | test("User deleted|^excluido|Conta excluída"; "i") | not))
| map(select((.slug // "") | startswith("excluido-") | not))
| unique_by(.id_user)
| sort_by([(if .sms == true then 0 else 1 end), -.id_user])
| map(.nome = (.nome // "") | . + {espera: false, primeiro: (if .nome == "" then "" else primeiro(.nome) end)})
