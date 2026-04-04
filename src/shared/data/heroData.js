export const stats = [
  { label: "Active Students", value: "100+", icon: "Users" },
  { label: "University Partners", value: "PCCOE", icon: "GraduationCap" },
  { label: "Career Placements", value: "10+", icon: "Briefcase" }
];

export const codeExamples = [
  {
    problem: "Two Sum",
    code: `def two_sum(nums, target):
    hash_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i
    return []`,
    language: "Python"
  },
  {
    problem: "Binary Search",
    code: `function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    language: "JavaScript"
  }
];
