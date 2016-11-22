

$regex_filename = [regex] '([\w\d._]+)_'
$path = $args[0]
$newdir

if (Test-Path ($path)) {
	$file_list = Get-ChildItem -Path $path -File
}
else {
	Write-Host ("Path not found.")
	break	
}

if ($file_list -eq $null) {
	Write-Host ("No files found.")
	break
}

foreach ($item in $file_list) {
	$filename = $regex_filename.match($item.tostring())
	$filename = $filename.captures.groups[1].tostring()
	
	if ($filename -ne $newdir.name) {
		$newpath = $path + "\" + $filename
		if (-not (Test-Path ($newpath))) {
			write-host ("Creating directory " + $filename + ".`r`n")
			# store folder path
			$newdir = New-Item $newpath -type directory
		}
		else {
			write-host ("Directory " + $filename + " found.`r`n")
			$newdir = Get-Item $newpath
		}
	}
	Write-Host ("Moving " + $item.tostring() + " to " + $newDir.tostring())
	Move-Item $item.fullname -Destination $newdir
}
