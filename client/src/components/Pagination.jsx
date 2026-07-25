import { Button, Flex, IconButton, Text } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import "./pagination.css";

/**
 * Radix Themes pagination.
 *
 * Usage:
 *   <Pagination page={page} count={totalPages} onPageChange={setPage} />
 *
 * Props:
 *   page         current page, 1-indexed
 *   count        total number of pages
 *   onPageChange (page: number) => void
 *   siblingCount how many page numbers to show on each side of current (default 1)
 */
export function Pagination({ page, count, onPageChange, siblingCount = 1 }) {
  if (count <= 1) return null;

  const range = getPageRange(page, count, siblingCount);

  return (
    <Flex asChild align="center" gap="2" role="navigation" aria-label="Pagination">
      <nav>
        <IconButton
          variant="soft"
          color="gray"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </IconButton>

        {range.map((item, i) =>
          item === "ellipsis" ? (
            <Text key={`e-${i}`} size="2" color="gray" className="pagination-ellipsis">
              …
            </Text>
          ) : (
            <Button
              key={item}
              size="2"
              variant={item === page ? "solid" : "soft"}
              color={item === page ? undefined : "gray"}
              className="pagination-page-btn"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </Button>
          )
        )}

        <IconButton
          variant="soft"
          color="gray"
          disabled={page === count}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </IconButton>
      </nav>
    </Flex>
  );
}

/**
 * Returns an array like [1, "ellipsis", 4, 5, 6, "ellipsis", 20]
 */
function getPageRange(page, count, siblingCount) {
  const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2 ellipses
  if (count <= totalNumbers) {
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, count);

  console.log(page + siblingCount, page, siblingCount);
  console.log("Siblings: ", leftSibling, rightSibling);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < count - 1;

  const range = [1];

  if (showLeftEllipsis) range.push("ellipsis");
  else
    for (let i = 2; i < leftSibling; i++) range.push(i);

  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== count) range.push(i);
  }

  if (showRightEllipsis) range.push("ellipsis");
  else
    for (let i = rightSibling + 1; i < count; i++) range.push(i);

  range.push(count);

  console.log(range);
  return range;
}
