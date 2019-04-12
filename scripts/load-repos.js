import { fail, main } from './utils'

main('load-repos', () => fail('work in progress'))

// TODO:
// load_data() {
//   local repos=( spring-cloud/spring-cloud-dataflow )
//   clean_data_dir
//
//   local versions=$(cat versions)
//
//   for repo in $repos; do
//     for version in $versions; do
//       load_git $repo $version
//     done
//
//   done
// }
//
// load_git() {
//   local repo=$1 version=$2
//   local path="./data/$repo/$version/"
//   mkdir -p "$path"
//   curl -Ls "https://github.com/$repo/archive/$version.tar.gz" | tar -xzf - -C "$path" --strip-components=2
// }
//
