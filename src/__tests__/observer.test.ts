import { Observer } from '../internal/observer';

describe('Observer', () => {
  it('should call the handler with the correct data when updated', () => {
      // Arrange
      const mockHandler = jest.fn();
      const observer = new Observer<number>(mockHandler);

      // Act
      observer.next(42);

      // Assert
      expect(mockHandler).toHaveBeenCalledWith(42);
  });

  it('should call the handler with the correct data for different types', () => {
      // Arrange
      const mockHandler = jest.fn();
      const observer = new Observer<string>(mockHandler);

      // Act
      observer.next('Hello, Observer!');

      // Assert
      expect(mockHandler).toHaveBeenCalledWith('Hello, Observer!');
  });

  // Add more test cases as needed
});